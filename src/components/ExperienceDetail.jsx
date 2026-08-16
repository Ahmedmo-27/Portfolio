import Calendar from 'lucide-react/dist/esm/icons/calendar'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import { assetUrl } from '../utils/assetUrl'

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])

export default function ExperienceDetail({ exp, index }) {
  if (!exp) return null

  const attachments = [...toArray(exp.documents), ...toArray(exp.certificate)].filter(Boolean)

  return (
    <div className="experience-detail h-full">
      <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5">
        <div
          className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
          aria-hidden="true"
        >
          <exp.icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            id={`exp-title-${index}`}
            className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-foreground mb-1 leading-tight break-words"
          >
            {exp.company}
          </h3>
          <p className="dark:text-primary-400 text-primary-500 font-medium text-xs sm:text-sm md:text-base">
            {exp.role}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-5 text-xs sm:text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar className="dark:text-primary-400 text-primary-500 w-3.5 md:w-4 h-3.5 md:h-4" aria-hidden="true" />
          <time>{exp.period}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-accent-cyan" aria-hidden="true" />
          {exp.location}
        </span>
      </div>

      <ul className="space-y-2 mb-4 md:mb-5" role="list">
        {exp.highlights.map((highlight, i) => (
          <li key={`${exp.company}-highlight-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 md:mt-2 flex-shrink-0" aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
        {exp.tags.map((tag) => (
          <span key={tag} className="tech-tag text-[10px] sm:text-xs" role="listitem">
            {tag}
          </span>
        ))}
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 md:mt-5 pt-4 border-t border-border/60">
          <p className="text-xs font-semibold text-foreground mb-2">Certificate / Documents</p>
          <div className="flex flex-wrap gap-2">
            {attachments.map((doc) => {
              const resolvedHref = assetUrl(doc.href)
              const isExternal = typeof resolvedHref === 'string' && resolvedHref.startsWith('http')
              return (
                <a
                  key={`${exp.company}-${doc.label}-${doc.href}`}
                  href={resolvedHref}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-border px-2.5 py-1.5 dark:text-primary-400 text-[11px] text-primary-500 hover:text-primary-500 hover:border-primary-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="truncate max-w-[220px]">{doc.label}</span>
                  {isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
