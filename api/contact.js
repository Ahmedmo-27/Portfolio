import { buildContactEmail } from '../server/contactEmailTemplate.js'
import { createTransporter, getEmailConfig } from '../server/emailConfig.js'

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const rate = new Map()

function allowRequest(ip) {
  const now = Date.now()
  const entry = rate.get(ip)
  if (!entry || entry.resetAt <= now) {
    rate.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count += 1
  return true
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

async function parseJsonBody(req) {
  if (req.body) return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.headers['cf-connecting-ip'] || req.socket?.remoteAddress || 'unknown'

  if (!allowRequest(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' })
  }

  const body = await parseJsonBody(req)
  if (!body) return res.status(400).json({ ok: false, error: 'invalid_json' })

  const { name, email, subject, message, company } = body || {}

  if (company) {
    return res.status(400).json({ ok: false, error: 'invalid' })
  }

  const safeName = String(name || '').trim()
  const safeEmail = String(email || '').trim()
  const safeSubject = String(subject || '').trim()
  const safeMessage = String(message || '').trim()

  if (
    safeName.length < 2 ||
    safeSubject.length < 3 ||
    safeMessage.length < 10 ||
    !isEmail(safeEmail)
  ) {
    return res.status(400).json({ ok: false, error: 'validation' })
  }

  try {
    const cfg = getEmailConfig(process.env)
    const transporter = createTransporter(cfg)

    const mail = buildContactEmail({
      brandName: cfg.brand.name,
      siteUrl: cfg.brand.siteUrl,
      logoUrl: cfg.brand.logoUrl,
      fromEmail: cfg.contact.fromEmail,
      safeName,
      safeEmail,
      safeSubject,
      safeMessage,
      ip,
    })

    await transporter.sendMail({
      from: mail.from,
      to: cfg.contact.toEmail,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo,
      headers: mail.headers,
    })

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[contact] send_failed', e)

    if (e?.code === 'server_not_configured') {
      return res.status(500).json({ ok: false, error: 'server_not_configured' })
    }

    const code = e?.code || e?.responseCode
    const msg = String(e?.message || '').toLowerCase()

    if (msg.includes('self-signed certificate')) {
      return res.status(500).json({ ok: false, error: 'smtp_tls_failed' })
    }
    if (code === 'EAUTH' || code === 535) {
      return res.status(500).json({ ok: false, error: 'smtp_auth_failed' })
    }
    if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ECONNREFUSED') {
      return res.status(500).json({ ok: false, error: 'smtp_connection_failed' })
    }

    return res.status(500).json({ ok: false, error: 'send_failed' })
  }
}
