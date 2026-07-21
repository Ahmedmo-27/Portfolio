import { useInViewOnce } from '../utils/useInViewOnce'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import Medal from 'lucide-react/dist/esm/icons/medal'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import Download from 'lucide-react/dist/esm/icons/download'
import { assetUrl } from '../utils/assetUrl'
import { useEffect } from 'react'

const achievements = [
  {
    title: 'Best Web Project of 2025',
    organization: 'Misr International University',
    description: 'Recognized for building Vaultique — a production e-commerce platform with JWT/Google OAuth, real-time inventory, 90%+ test coverage, and a Three.js configurator while leading a 5-member team.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    isHighlighted: true,
    website: 'https://vaultique.live',
  },
  {
    title: 'Top 5 — ITIDA Software Testing Day 2026',
    organization: 'ITIDA-SECC (4th Edition · 128 teams)',
    description: 'Placed Top 5 with Debuggo, an AI-powered VS Code extension using AST-based analysis to generate context-aware tests across 1,000+ project files.',
    icon: Medal,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    isHighlighted: true,
    showProjectsLink: true,
  },
  {
    title: 'Semifinalist in DIGITOPIA 2025',
    organization: 'Digitopia Competition — Cybersecurity',
    description: 'Team reached semifinals with Cybertopia, a Cowrie-based honeypot platform analyzing 500K+ SSH attack logs from 300+ malicious IPs.',
    icon: Medal,
    color: 'from-slate-300 to-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    isHighlighted: true,
    showProjectsLink: true,
  },
  {
    title: 'Recommendation Letter (NBE Internship)',
    organization: 'National Bank of Egypt (NBE)',
    description: 'Received a recommendation letter from my internship supervisor for DevOps & automation contributions in live banking environments.',
    icon: FileText,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    pdfUrl: '/Experience/NBE Letter of Recommendation.pdf',
    isHighlighted: true,
  },
]

export default function Achievements() {
  const { ref, isInView } = useInViewOnce()

  useEffect(() => {
    if (isInView && window.location.hash !== '#about') {
      window.history.replaceState(null, '', '#about')
    }
    }, [isInView])
  
  return (
    <section 
      id="achievements" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="achievements-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4" style={{ backgroundColor: 'var(--pill-ach-bg)', color: 'var(--pill-ach-fg)', borderColor: 'rgba(245, 158, 11, 0.22)' }}>
              <span className="w-1.5 h-1.5 rounded-full" aria-hidden="true" style={{ backgroundColor: 'var(--pill-ach-dot)' }} />
              Achievements
            </span>
            <h2 id="achievements-heading" className="section-heading mb-6">
              Recognition & <span className="gradient-text">Awards</span>
            </h2>
            <p className="section-subheading mx-auto">
              Highlights of accomplishments and recognition received throughout 
              my academic and professional journey.
            </p>
          </div>

          {/* Highlighted Achievements - Featured Cards */}
          <div className='mb-8'>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.filter(a => a.isHighlighted).map((achievement, index) => (
                <article
                  key={achievement.title}
                  style={{ ['--animation-delay']: `${index * 0.15 + 0.2}s` }}
                  className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border-2 ${achievement.borderColor} ${achievement.bgColor} group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform transition-shadow duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10 focus-visible:-translate-y-2 focus-visible:scale-[1.02] achievements-featured-item`}
                  tabIndex={0}
                  aria-labelledby={`achievement-${achievement.title.replace(/\s+/g, '-')}`}
                >
                  {/* Glow effect */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${achievement.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} aria-hidden="true" />
                  
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-amber/30 text-accent-amber text-xs font-bold">
                      ⭐ Featured
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-6 shadow-lg`} aria-hidden="true">
                    <achievement.icon className="w-8 sm:w-10 h-8 sm:h-10 text-dark-900" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 
                      id={`achievement-${achievement.title.replace(/\s+/g, '-')}`}
                      className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2"
                    >
                      {achievement.title}
                    </h3>
                    <p className="dark:text-primary-400 text-primary-500 font-medium text-sm mb-1">
                      {achievement.organization}
                    </p>
                    <p className="text-muted text-sm sm:text-base">
                      {achievement.description}
                    </p>

                    <div className="mt-5 ach-actions-placeholder">
                      {(achievement.website || achievement.pdfUrl || achievement.showExperienceLink || achievement.showProjectsLink) && (
                        <div className="flex flex-wrap gap-4">
                          {achievement.website && (
                            <a
                              href={achievement.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                            >
                              Visit Website
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            </a>
                          )}
                          {achievement.pdfUrl && (
                            <>
                              {(() => {
                                const pdfHref = assetUrl(achievement.pdfUrl)
                                return (
                                  <a
                                    href={pdfHref}
                                    download
                                    className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                                  >
                                    <Download className="w-4 h-4" aria-hidden="true" />
                                    Download PDF
                                  </a>
                                )
                              })()}
                              <a
                                href="/#experience"
                                className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                              >
                                View Experience
                                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                              </a>
                            </>
                          )}
                          {achievement.showExperienceLink && !achievement.pdfUrl && (
                            <a
                              href="/#experience"
                              className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                            >
                              View Experience
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            </a>
                          )}
                          {achievement.showProjectsLink && (
                            <a
                              href="/#projects"
                              className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                            >
                              View Projects
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative background icon */}
                  <div className="absolute bottom-4 right-4 opacity-10" aria-hidden="true">
                    <achievement.icon className="w-20 sm:w-28 h-20 sm:h-28" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}