import { useState } from 'react'
import { Mail, MapPin, Send, Github, Linkedin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useInViewOnce } from '../utils/useInViewOnce'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ahmedmostafa.swe1@gmail.com',
    href: 'mailto:ahmedmostafa.swe1@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Cairo, Egypt',
    href: null,
  },
]

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/ahmedmo-27',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ahmedmostafa-swe',
  },
]

export default function Contact() {
  const { ref, isInView } = useInViewOnce()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setStatusMessage('')

    // Basic anti-bot honeypot: real users won't fill this hidden field
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
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          company: honeypot, // honeypot field name used by server
        }),
      })

      const payload = await res.json().catch(() => null)
      if (!res.ok || !payload?.ok) {
        const errCode = payload?.error || 'send_failed'
        if (errCode === 'server_not_configured') {
          throw new Error('server_not_configured')
        }
        if (errCode === 'smtp_auth_failed') {
          throw new Error('smtp_auth_failed')
        }
          if (errCode === 'smtp_tls_failed') {
            throw new Error('smtp_tls_failed')
          }
        if (errCode === 'smtp_connection_failed') {
          throw new Error('smtp_connection_failed')
        }
        if (errCode === 'invalid_json' || errCode === 'validation') {
          throw new Error('validation')
        }
        throw new Error('send_failed')
      }

      setStatus('success')
      setStatusMessage('Message sent successfully. I\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setHoneypot('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      // Avoid leaking details, but keep it helpful
      setStatus('error')
      const code = String(err?.message || '')
      if (code === 'server_not_configured') {
        setStatusMessage('Backend email is not configured yet (SMTP env vars missing).')
      } else if (code === 'smtp_auth_failed') {
        setStatusMessage('SMTP authentication failed. Check Gmail App Password / SMTP credentials.')
      } else if (code === 'smtp_tls_failed') {
        setStatusMessage(
          'SMTP TLS failed (certificate issue). This is usually caused by a VPN/corporate proxy/antivirus doing SSL inspection. Try disabling SSL inspection/VPN or use a network without interception.'
        )
      } else if (code === 'smtp_connection_failed') {
        setStatusMessage('SMTP connection failed. Check SMTP host/port and network/firewall.')
      } else if (code === 'validation') {
        setStatusMessage('Please check your inputs and try again.')
      } else {
        setStatusMessage('Failed to send. Please try again or email me directly.')
      }
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section 
      id="contact" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" aria-hidden="true" />
              Contact
            </span>
            <h2 id="contact-heading" className="section-heading mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="section-subheading mx-auto">
              Have a project in mind or want to discuss opportunities? 
              I'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className={`space-y-6 md:space-y-8 ${isInView ? 'animate-fade-in-up animate-delay-2' : 'opacity-0'}`}>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 md:mb-6">
                  Get in Touch
                </h3>
                <p className="text-muted text-sm md:text-base mb-6 md:mb-8">
                  I'm currently open to new opportunities, whether it's internships, 
                  full-time positions, or freelance projects. Feel free to reach out!
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 md:space-y-4" role="list" aria-label="Contact information">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 md:gap-4" role="listitem">
                    <div 
                      className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-surface flex items-center justify-center border border-border"
                      aria-hidden="true"
                    >
                      <item.icon className="w-4 md:w-5 h-4 md:h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-muted-foreground/60 text-xs md:text-sm">{item.label}</p>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-foreground hover:text-primary-400 transition-colors text-sm md:text-base focus-visible:outline-none focus-visible:text-primary-400"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground text-sm md:text-base">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <p className="text-muted-foreground/60 text-xs md:text-sm mb-3 md:mb-4">Find me on</p>
                <div className="flex gap-3" role="list" aria-label="Social media links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 md:w-12 h-10 md:h-12 rounded-xl glass hover:bg-surface-hover flex items-center justify-center text-muted hover:text-foreground transition-[transform,color] duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      aria-label={`Visit my ${social.label} profile`}
                      role="listitem"
                    >
                      <social.icon className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <div className="glass-card p-4 md:p-6" role="status" aria-live="polite">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-accent-emerald" aria-hidden="true" />
                  <span className="text-accent-emerald font-medium text-sm md:text-base">Available for Opportunities</span>
                </div>
                <p className="text-muted text-xs md:text-sm">
                  Seeking Junior Software Engineer roles in backend and full-stack development. 
                  Open to internships and full-time positions where I can contribute to building scalable APIs and web applications.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={isInView ? 'animate-fade-in-up animate-delay-2' : 'opacity-0'}>
              <form 
                onSubmit={handleSubmit} 
                className="glass-card p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6"
                aria-label="Contact form"
              >
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs md:text-sm font-medium text-muted mb-1.5 md:mb-2">
                      Name <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm md:text-base"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-muted mb-1.5 md:mb-2">
                      Email <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm md:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  {/* Honeypot (anti-bot). Hidden visually but present for simple spam protection. */}
                  <label className="sr-only" htmlFor="company">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-muted mb-1.5 md:mb-2">
                    Subject <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm md:text-base"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-muted mb-1.5 md:mb-2">
                    Message <span className="text-red-400" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    rows={5}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface border border-border text-foreground placeholder-muted/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none text-sm md:text-base"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn-primary text-sm md:text-base"
                  aria-describedby="form-status"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
                      <span>Message Sent!</span>
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
                      <span>Failed to Send</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Status message for screen readers */}
                <div id="form-status" className="sr-only" role="status" aria-live="polite">
                  {status === 'loading' && 'Sending your message...'}
                  {status === 'success' && 'Your message has been sent successfully!'}
                  {status === 'error' && 'Failed to send message. Please try again.'}
                </div>

                {/* Visible status message */}
                {statusMessage && (
                  <p className="text-center text-xs md:text-sm text-muted">
                    {statusMessage}
                  </p>
                )}

                <p className="text-center text-muted-foreground/60 text-xs md:text-sm">
                  Or email me directly at{' '}
                  <a 
                    href="mailto:ahmedmostafa.swe1@gmail.com" 
                    className="text-primary-400 hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    ahmedmostafa.swe1@gmail.com
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}