import { useState } from 'react'
import Mail from 'lucide-react/dist/esm/icons/mail'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import Github from 'lucide-react/dist/esm/icons/github'
import Linkedin from 'lucide-react/dist/esm/icons/linkedin'
import { useInViewOnce } from '../utils/useInViewOnce'
import ContactDetails from './ContactDetails'
import ContactForm from './ContactForm'

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
    value: 'Heliopolis, Cairo',
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

  // URL hash updates are handled centrally by the Navbar observer

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
    <section id="contact" className="py-16 md:py-28 relative overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" aria-hidden="true" />
              Contact
            </span>
            <h2 id="contact-heading" className="section-heading mb-6">Let's <span className="gradient-text">Connect</span></h2>
            <p className="section-subheading mx-auto">Have a project in mind or want to discuss opportunities? I'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <ContactDetails contactInfo={contactInfo} socialLinks={socialLinks} />
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}