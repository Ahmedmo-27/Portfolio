import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100kb' }));

// Return JSON on invalid JSON bodies (instead of default HTML error page)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ ok: false, error: 'invalid_json' });
  }
  return next(err);
});

const rate = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
function allowRequest(ip) {
  const now = Date.now();
  const entry = rate.get(ip);
  if (!entry || entry.resetAt <= now) {
    rate.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

app.post('/api/contact', async (req, res) => {
  const ip = req.headers['cf-connecting-ip'] || req.ip || 'unknown';
  if (!allowRequest(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const { name, email, subject, message, company } = req.body || {};

  // Honeypot
  if (company) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const safeName = String(name || '').trim();
  const safeEmail = String(email || '').trim();
  const safeSubject = String(subject || '').trim();
  const safeMessage = String(message || '').trim();

  if (
    safeName.length < 2 ||
    safeSubject.length < 3 ||
    safeMessage.length < 10 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)
  ) {
    return res.status(400).json({ ok: false, error: 'validation' });
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  try {
    const portNum = Number(SMTP_PORT);
    if (!Number.isFinite(portNum) || portNum <= 0) {
      return res.status(500).json({ ok: false, error: 'server_not_configured' });
    }
    const secure =
      String(SMTP_SECURE || '').toLowerCase() === 'true' ||
      (String(SMTP_SECURE || '').toLowerCase() !== 'false' && portNum === 465);

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: portNum,
      secure, // boolean: true for 465, false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const from = CONTACT_FROM_EMAIL || SMTP_USER;
    const text = [
      `New message from portfolio contact form`,
      ``,
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      `Subject: ${safeSubject}`,
      ``,
      safeMessage,
      ``,
      `---`,
      `IP: ${ip}`,
    ].join('\n');

    await transporter.sendMail({
      from: `Portfolio Contact <${from}>`,
      to: CONTACT_TO_EMAIL,
      subject: `[Portfolio] ${safeSubject}`,
      text,
      replyTo: safeEmail,
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error('[contact] send_failed', e);

    // Provide a safer, more actionable code (don’t leak full error to client)
    const code = e?.code || e?.responseCode;
    const msg = String(e?.message || '').toLowerCase();

    if (msg.includes('self-signed certificate')) {
      return res.status(500).json({ ok: false, error: 'smtp_tls_failed' });
    }
    if (code === 'EAUTH' || code === 535) {
      return res.status(500).json({ ok: false, error: 'smtp_auth_failed' });
    }
    if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ECONNREFUSED') {
      return res.status(500).json({ ok: false, error: 'smtp_connection_failed' });
    }

    return res.status(500).json({ ok: false, error: 'send_failed' });
  }
});

// Serve static files from the dist directory
const distDir = join(__dirname, 'dist');
if (existsSync(distDir)) {
  app.use(
    express.static(distDir, {
      setHeaders: (res, path) => {
        // Ensure PDFs are served inline (some platforms default to downloading)
        if (path.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
        }
      },
    })
  );

  // Handle React Router - serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});