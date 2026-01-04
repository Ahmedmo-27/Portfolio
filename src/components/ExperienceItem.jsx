import React from 'react'
import batchSetProperty from '../utils/batchStyle'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import { assetUrl } from '../utils/assetUrl'

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

export default function ExperienceItem({ exp, index }) {
  return (
    <article
      key={exp.company}
      ref={(el) => {
        if (el) batchSetProperty(el, '--animation-delay', `${index * 0.15 + 0.2}s`)
      }}
      className={`relative flex flex-col md:flex-row gap-6 md:gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} experience-item animate-fade-in-left`}
      role="listitem"
      aria-labelledby={`exp-title-${index}`}
    >
      <div className="absolute left-4 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-card border-2 border-primary-500 transform -translate-x-1/2 z-10" aria-hidden="true" />

      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 lg:pr-12' : 'md:pl-8 lg:pl-12'} pl-10 md:pl-0`}>
        <div className="glass-card p-4 sm:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1" tabIndex={0}>
          <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
            <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
              <exp.icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id={`exp-title-${index}`} className="text-base sm:text-lg md:text-xl font-display font-semibold text-foreground mb-1 leading-tight break-words">
                {exp.company}
              </h3>
              <p className="dark:text-primary-400 text-primary-500 font-medium text-xs sm:text-sm">{exp.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 mb-3 md:mb-4 text-xs sm:text-sm text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="dark:text-primary-400 text-primary-500 w-3.5 md:w-4 h-3.5 md:h-4" aria-hidden="true" />
              <time>{exp.period}</time>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-accent-cyan" aria-hidden="true" />
              {exp.location}
            </span>
          </div>

          <ul className="space-y-1.5 md:space-y-2 mb-3 md:mb-4" role="list">
            {exp.highlights.map((highlight, i) => (
              <li key={`${exp.company}-highlight-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 md:mt-2 flex-shrink-0" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
            {exp.tags.map((tag) => (
              <span key={tag} className="tech-tag text-[10px] sm:text-xs" role="listitem">{tag}</span>
            ))}
          </div>

          {(() => {
            const attachments = [...toArray(exp.documents), ...toArray(exp.certificate)].filter(Boolean)
            if (attachments.length === 0) return null
            return (
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/60">
                <p className="text-xs font-semibold text-foreground mb-2">Certificate / Documents</p>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((doc) => {
                    const resolvedHref = assetUrl(doc.href)
                    const isExternal = typeof resolvedHref === 'string' && resolvedHref.startsWith('http')
                    return (
                      <a key={`${exp.company}-${doc.label}-${doc.href}`} href={resolvedHref} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-border px-2.5 py-1.5 dark:text-primary-400 text-[11px] text-primary-500 hover:text-primary-500 hover:border-primary-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="truncate max-w-[220px]">{doc.label}</span>
                        {isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />}
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="hidden md:block md:w-1/2" aria-hidden="true" />
    </article>
  )
}
