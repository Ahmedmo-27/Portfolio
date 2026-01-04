import React from 'react'

export default function ContactDetails({ contactInfo, socialLinks }) {
  return (
    <div className= 'space-y-6 md:space-y-8'>
      <div>
        <h3 className="text-xl md:text-2xl font-display font-bold text-[color:var(--color-muted)] mb-4 md:mb-6">Get in Touch</h3>
        <p className="text-[color:var(--color-foreground)] text-sm md:text-base mb-6 md:mb-8">
          I'm currently open to new opportunities, whether it's internships, full-time positions, or freelance projects. Feel free to reach out!
        </p>
      </div>

      <div className="space-y-3 md:space-y-4" role="list" aria-label="Contact information">
        {contactInfo.map((item) => (
          <div key={item.label} className="flex items-center gap-3 md:gap-4" role="listitem">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 flex items-center justify-center border border-primary-500/30" aria-hidden="true">
              <item.icon className="w-4 md:w-5 h-4 md:h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-[color:var(--color-foreground)] text-xs md:text-sm">{item.label}</p>
              {item.href ? (
                <a href={item.href} className="text-[color:var(--color-muted)] hover:text-primary-400 transition-colors text-sm md:text-base focus-visible:outline-none focus-visible:text-primary-400">{item.value}</a>
              ) : (
                <p className="text-[color:var(--color-muted)] text-sm md:text-base">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[color:var(--color-foreground)] text-xs md:text-sm mb-3 md:mb-4">Find me on</p>
        <div className="flex gap-3" role="list" aria-label="Social media links">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 md:w-12 h-10 md:h-12 rounded-xl glass hover:bg-primary-500/10 hover:border-primary-500/40 flex items-center justify-center text-[color:var(--color-foreground)] hover:text-primary-400 transition-[transform,color,background-color,border-color] duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" aria-label={`Visit my ${social.label} profile`} role="listitem">
              <social.icon className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 md:p-6" role="status" aria-live="polite">
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <span className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-accent-emerald" aria-hidden="true" />
          <span className="text-accent-emerald font-medium text-sm md:text-base">Available for Opportunities</span>
        </div>
        <p className="text-[color:var(--color-foreground)] text-xs md:text-sm">Seeking Junior Software Engineer roles in backend and full-stack development. Open to internships and full-time positions where I can contribute to building scalable APIs and web applications.</p>
      </div>
    </div>
  )
}
