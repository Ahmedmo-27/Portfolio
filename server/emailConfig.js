import nodemailer from 'nodemailer'

function toBool(value) {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

export function getEmailConfig(env = process.env) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL,
    SITE_URL,
    BRAND_NAME,
    BRAND_LOGO_URL,
  } = env

  const portNum = Number(SMTP_PORT)
  const parsedSecure = toBool(SMTP_SECURE)
  const secure =
    parsedSecure !== undefined ? parsedSecure : Number.isFinite(portNum) && portNum === 465

  const missing = []
  if (!SMTP_HOST) missing.push('SMTP_HOST')
  if (!SMTP_PORT) missing.push('SMTP_PORT')
  if (!SMTP_USER) missing.push('SMTP_USER')
  if (!SMTP_PASS) missing.push('SMTP_PASS')
  if (!CONTACT_TO_EMAIL) missing.push('CONTACT_TO_EMAIL')

  if (missing.length) {
    const err = new Error('server_not_configured')
    err.code = 'server_not_configured'
    err.missing = missing
    throw err
  }

  if (!Number.isFinite(portNum) || portNum <= 0) {
    const err = new Error('server_not_configured')
    err.code = 'server_not_configured'
    err.missing = ['SMTP_PORT']
    throw err
  }

  return {
    smtp: {
      host: SMTP_HOST,
      port: portNum,
      secure,
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    contact: {
      toEmail: CONTACT_TO_EMAIL,
      fromEmail: CONTACT_FROM_EMAIL || SMTP_USER,
    },
    brand: {
      name: (BRAND_NAME || 'Ahmed Mostafa').trim() || 'Ahmed Mostafa',
      siteUrl: (SITE_URL || '').trim(),
      logoUrl: (BRAND_LOGO_URL || '').trim(),
    },
  }
}

export function createTransporter(emailConfig) {
  return nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    auth: { user: emailConfig.smtp.user, pass: emailConfig.smtp.pass },
  })
}


