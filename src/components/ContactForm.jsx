import React, { useState } from 'react'
import Send from 'lucide-react/dist/esm/icons/send'
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle'
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setStatusMessage('')

    if (honeypot) {
      setStatus('error')
      setStatusMessage('Failed to send. Please try again.')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    const name = formData.name.trim()
    const email = formData.email.trim()
    const subject = formData.subject.trim()
    const message = formData.message.trim()

    if (!name || name.length < 2) {
      setStatus('error')
      setStatusMessage('Please enter your name.')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }
    if (!isEmail(email)) {
      setStatus('error')
      setStatusMessage('Please enter a valid email address.')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }
    if (!subject || subject.length < 3) {
      setStatus('error')
      setStatusMessage('Please enter a subject.')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }
    if (!message || message.length < 10) {
      setStatus('error')
      setStatusMessage('Please enter a longer message (at least 10 characters).')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, company: honeypot }),
      })

      const payload = await res.json().catch(() => null)
      if (!res.ok || !payload?.ok) {
        const errCode = payload?.error || 'send_failed'
        throw new Error(errCode)
      }

      setStatus('success')
      setStatusMessage("Message sent successfully. I'll get back to you soon.")
      setFormData({ name: '', email: '', subject: '', message: '' })
      setHoneypot('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
      const code = String(err?.message || '')
      if (code === 'server_not_configured') setStatusMessage('Backend email is not configured yet (SMTP env vars missing).')
      else if (code === 'smtp_auth_failed') setStatusMessage('SMTP authentication failed. Check Gmail App Password / SMTP credentials.')
      else if (code === 'smtp_tls_failed') setStatusMessage('SMTP TLS failed (certificate issue). Try a different network.')
      else if (code === 'smtp_connection_failed') setStatusMessage('SMTP connection failed. Check SMTP host/port and network/firewall.')
      else if (code === 'validation') setStatusMessage('Please check your inputs and try again.')
      else setStatusMessage('Failed to send. Please try again or email me directly.')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6" aria-label="Contact form">
      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label htmlFor="name" className="block text-xs md:text-sm font-medium text-[color:var(--color-foreground)] mb-1.5 md:mb-2">Name <span className="text-red-400" aria-hidden="true">*</span></label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required aria-required="true" className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-[color:var(--color-muted)] placeholder-[color:var(--color-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-colors text-sm md:text-base" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs md:text-sm font-medium text-[color:var(--color-foreground)] mb-1.5 md:mb-2">Email <span className="text-red-400" aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required aria-required="true" className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-[color:var(--color-muted)] placeholder-[color:var(--color-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-colors text-sm md:text-base" placeholder="your@email.com" />
        </div>
      </div>

      <div>
        <label className="sr-only" htmlFor="company">Company</label>
        <input id="company" name="company" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

        <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-[color:var(--color-foreground)] mb-1.5 md:mb-2">Subject <span className="text-red-400" aria-hidden="true">*</span></label>
        <input id="subject" name="subject" value={formData.subject} onChange={handleChange} required aria-required="true" className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-[color:var(--color-muted)] placeholder-[color:var(--color-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-colors text-sm md:text-base" placeholder="What's this about?" />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs md:text-sm font-medium text-[color:var(--color-foreground)] mb-1.5 md:mb-2">Message <span className="text-red-400" aria-hidden="true">*</span></label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required aria-required="true" rows={5} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-[color:var(--color-muted)] placeholder-[color:var(--color-muted)] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-colors resize-none text-sm md:text-base" placeholder="Tell me about your project or opportunity..." />
      </div>

      <button type="submit" disabled={status === 'loading'} className="w-full btn-primary text-sm md:text-base" aria-describedby="form-status">
        {status === 'loading' ? (
          <><Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" aria-hidden="true" /><span>Sending...</span></>
        ) : status === 'success' ? (
          <><CheckCircle className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" /><span>Message Sent!</span></>
        ) : status === 'error' ? (
          <><AlertCircle className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" /><span>Failed to Send</span></>
        ) : (
          <><Send className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" /><span>Send Message</span></>
        )}
      </button>

      <div id="form-status" className="sr-only" role="status" aria-live="polite">
        {status === 'loading' && 'Sending your message...'}
        {status === 'success' && 'Your message has been sent successfully!'}
        {status === 'error' && 'Failed to send message. Please try again.'}
      </div>

      {statusMessage && (<p className="text-center text-xs md:text-sm text-[color:var(--color-foreground)]">{statusMessage}</p>)}

      <p className="text-center text-[color:var(--color-foreground)] text-xs md:text-sm">Or email me directly at <a href="mailto:ahmedmostafa.swe1@gmail.com" className="text-primary-400 hover:underline focus-visible:underline focus-visible:outline-none">ahmedmostafa.swe1@gmail.com</a></p>
    </form>
  )
}
