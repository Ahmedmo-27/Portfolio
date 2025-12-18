function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toHtmlWithLineBreaks(text) {
  return escapeHtml(text).replaceAll('\n', '<br />')
}

/**
 * Builds a styled HTML email + plain text fallback for contact form submissions.
 */
export function buildContactEmail({
  brandName,
  siteUrl,
  logoUrl,
  fromEmail,
  safeName,
  safeEmail,
  safeSubject,
  safeMessage,
  ip,
}) {
  const subject = `New Portfolio Message — ${safeSubject} — ${safeName}`

  const text = [
    `New portfolio contact form message`,
    ``,
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    `Subject: ${safeSubject}`,
    ``,
    safeMessage,
    ``,
    `---`,
    `IP: ${ip}`,
  ].join('\n')

  const html = `
    <div style="background:#0b1220;padding:24px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          New portfolio message from ${escapeHtml(safeName)} — ${escapeHtml(safeSubject)}
        </div>

        <div style="background:#0f172a;border:1px solid rgba(148,163,184,0.25);border-radius:16px;overflow:hidden;">
          <div style="padding:18px 18px 14px;border-bottom:1px solid rgba(148,163,184,0.18);background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(6,182,212,0.12));">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    ${
                      logoUrl
                        ? `<img src="${escapeHtml(logoUrl)}" width="36" height="36" alt="${escapeHtml(
                            brandName
                          )} logo" style="display:block;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(148,163,184,0.22);padding:6px;" />`
                        : ``
                    }
                    <div>
                      <div style="font-size:14px;font-weight:700;color:#e2e8f0;line-height:1.2;">${escapeHtml(
                        brandName
                      )}</div>
                      <div style="font-size:12px;color:rgba(226,232,240,0.72);margin-top:2px;">Portfolio Contact Form</div>
                    </div>
                  </div>
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  ${
                    siteUrl
                      ? `<a href="${escapeHtml(
                          siteUrl
                        )}" style="font-size:12px;color:#7dd3fc;text-decoration:none;">Open site</a>`
                      : ``
                  }
                </td>
              </tr>
            </table>
          </div>

          <div style="padding:18px;">
            <div style="font-size:18px;font-weight:800;color:#e2e8f0;margin:0 0 6px;">New message received</div>
            <div style="font-size:13px;color:rgba(226,232,240,0.72);margin:0 0 16px;">
              Reply directly to this email to respond (Reply-To is set to the sender).
            </div>

            <div style="border:1px solid rgba(148,163,184,0.18);border-radius:12px;overflow:hidden;margin-bottom:14px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 12px;background:rgba(2,6,23,0.35);font-size:12px;color:rgba(226,232,240,0.72);width:120px;">From</td>
                  <td style="padding:10px 12px;font-size:13px;color:#e2e8f0;">${escapeHtml(
                    safeName
                  )} &lt;${escapeHtml(safeEmail)}&gt;</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:rgba(2,6,23,0.35);font-size:12px;color:rgba(226,232,240,0.72);width:120px;">Subject</td>
                  <td style="padding:10px 12px;font-size:13px;color:#e2e8f0;">${escapeHtml(
                    safeSubject
                  )}</td>
                </tr>
              </table>
            </div>

            <div style="border:1px solid rgba(148,163,184,0.18);border-radius:12px;padding:12px;background:rgba(2,6,23,0.22);">
              <div style="font-size:12px;color:rgba(226,232,240,0.72);margin-bottom:8px;">Message</div>
              <div style="font-size:14px;line-height:1.55;color:#e2e8f0;white-space:normal;">
                ${toHtmlWithLineBreaks(safeMessage)}
              </div>
            </div>

            <div style="margin-top:14px;font-size:11px;color:rgba(226,232,240,0.55);">
              IP: ${escapeHtml(ip)}
            </div>
          </div>

          <div style="padding:14px 18px;border-top:1px solid rgba(148,163,184,0.18);background:rgba(2,6,23,0.25);font-size:11px;color:rgba(226,232,240,0.6);">
            This email was generated by your portfolio contact form.
          </div>
        </div>
      </div>
    </div>
  `.trim()

  return {
    subject,
    text,
    html,
    from: `${brandName} — Portfolio <${fromEmail}>`,
    replyTo: `${safeName} <${safeEmail}>`,
    headers: {
      'X-Portfolio-Contact': 'true',
      'X-Portfolio-Contact-From': safeEmail,
    },
  }
}


