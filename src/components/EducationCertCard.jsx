import React from 'react'
// animation delay is applied inline to avoid runtime style writes
import Award from 'lucide-react/dist/esm/icons/award'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'

export default function EducationCertCard({ cert, index, expandedCertSkills, toggleCertSkills, isNew = false }) {
  return (
    <article
      key={cert.id}
      className={`glass-card p-5 sm:p-6 group relative overflow-hidden transition-transform hover:-translate-y-1 education-cert-item gsap-reveal-item${isNew ? ' gsap-reveal-item-new' : ''}`}
      aria-label={cert.title}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 group-focus-visible:opacity-15 blur-3xl transition-opacity pointer-events-none`}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-3">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
          aria-hidden="true"
        >
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 flex items-center gap-1.5">
                {cert.title}
              </p>
              <p className="dark:text-primary-400 text-[11px] sm:text-xs font-medium text-primary-500 truncate mt-0.5">
                {cert.issuer}
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0 whitespace-nowrap">
              {cert.date}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-0.5 border border-border/60 text-[10px] text-muted">
              <span className="w-1 h-1 rounded-full bg-accent-emerald" aria-hidden="true" />
              {cert.type}
            </span>
          </div>

          {Array.isArray(cert.skills) && cert.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(expandedCertSkills[cert.id] ? cert.skills : cert.skills.slice(0, 3)).map((skill) => (
                <span
                  key={`${cert.id}-${skill}`}
                  className="rounded-full bg-surface/80 px-2 py-0.5 text-[10px] sm:text-[11px] text-muted border border-border/60 whitespace-nowrap"
                >
                  {skill}
                </span>
              ))}
              {cert.skills.length > 3 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleCertSkills(cert.id)
                  }}
                  className="dark:text-primary-400 text-[10px] sm:text-[11px] text-primary-500 hover:text-primary-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md px-1.5 whitespace-nowrap"
                  aria-expanded={!!expandedCertSkills[cert.id]}
                  aria-label={
                    expandedCertSkills[cert.id]
                      ? `Show fewer skills for ${cert.title}`
                      : `Show ${cert.skills.length - 3} more skills for ${cert.title}`
                  }
                >
                  {expandedCertSkills[cert.id]
                    ? 'Show less'
                    : `+${cert.skills.length - 3} more`}
                </button>
              )}
            </div>
          )}

          {(() => {
            const credentialLink = typeof cert.link === 'string' ? cert.link.trim() : ''
            const hasCredentialLink = credentialLink && credentialLink !== '#'
            if (!hasCredentialLink) return null

            const isExternal = credentialLink.startsWith('http')
            return (
              <a
                href={credentialLink}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 mt-1.5 dark:text-primary-400 text-[11px] text-primary-500 hover:text-primary-500 focus-visible:text-primary-500 transition-colors"
              >
                Show credential
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )
          })()}
        </div>
      </div>
    </article>
  )
}
