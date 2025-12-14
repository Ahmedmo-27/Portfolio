import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, MapPin, Send, Github, Linkedin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate form submission - Replace with actual email service integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ahmedmostafa2004@hotmail.com',
      href: 'mailto:ahmedmostafa2004@hotmail.com',
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

  return (
    <section 
      id="contact" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
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
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div variants={fadeInUp} className="space-y-6 md:space-y-8">
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
                      <p className="text-muted/60 text-xs md:text-sm">{item.label}</p>
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
                <p className="text-muted/60 text-xs md:text-sm mb-3 md:mb-4">Find me on</p>
                <div className="flex gap-3" role="list" aria-label="Social media links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 md:w-12 h-10 md:h-12 rounded-xl glass hover:bg-surface-hover flex items-center justify-center text-muted hover:text-foreground transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
                  <span className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-accent-emerald animate-pulse" aria-hidden="true" />
                  <span className="text-accent-emerald font-medium text-sm md:text-base">Available for Opportunities</span>
                </div>
                <p className="text-muted text-xs md:text-sm">
                  Looking for internships, DevOps/SRE roles, Android positions, 
                  or software engineering opportunities.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
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

                <p className="text-center text-muted/60 text-xs md:text-sm">
                  Or email me directly at{' '}
                  <a 
                    href="mailto:ahmedmostafa2004@hotmail.com" 
                    className="text-primary-400 hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    ahmedmostafa2004@hotmail.com
                  </a>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
