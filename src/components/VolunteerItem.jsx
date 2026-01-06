import batchSetProperty from '../utils/batchStyle'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import Star from 'lucide-react/dist/esm/icons/star'
import Heart from 'lucide-react/dist/esm/icons/heart'

export default function VolunteerItem({ exp, index }) {
  return (
    <article
      key={exp.organization}
      style={{ ['--animation-delay']: `${index * 0.15 + 0.2}s` }}
      className={`${exp.isHighlighted ? 'relative' : ''} volunteering-experience-item`}
      role="article"
      aria-labelledby={`vol-title-${index}`}
    >
      {exp.isHighlighted && (
        <div className="absolute -top-3 left-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs font-bold">
            <Heart className="w-3 h-3" aria-hidden="true" />
            Leadership Role
          </span>
        </div>
      )}

      <div
        className={`glass-card p-5 md:p-6 group transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${exp.isHighlighted ? 'ring-1 ring-accent-emerald/20' : ''}`}
        tabIndex={0}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
            aria-hidden="true"
          >
            <exp.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3
                  id={`vol-title-${index}`}
                  className="text-lg md:text-xl font-display font-bold text-foreground mb-1"
                >
                  {exp.organization}
                </h3>
                <p className="text-primary-400 font-medium text-sm md:text-base">
                  {exp.role}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-muted text-sm flex-shrink-0">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {exp.period}
              </span>
            </div>

            <p className="text-muted text-sm md:text-base mb-4">{exp.description}</p>

            <ul className="space-y-2 mb-4" role="list" aria-label="Key achievements">
              {exp.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-2 text-muted text-sm">
                  <Star className="w-3.5 h-3.5 text-accent-amber mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {achievement}
                </li>
              ))}
            </ul>

            {exp.link && (
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
