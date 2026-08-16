import { useState } from 'react'
import Mail from 'lucide-react/dist/esm/icons/mail'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import Github from 'lucide-react/dist/esm/icons/github'
import Linkedin from 'lucide-react/dist/esm/icons/linkedin'
import { useSectionReveal } from '../hooks/useSectionReveal'
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
  const scopeRef = useSectionReveal({
    itemSelector: '.gsap-reveal-item',
    stagger: 0.08,
    y: 24,
  })

  return (
    <section className="py-16 md:py-28 relative overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-14 md:mb-20">
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
