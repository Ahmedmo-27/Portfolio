import { useInViewOnce } from '../utils/useInViewOnce'
// Note: avoid runtime style writes here — use inline CSS custom properties
import { getNavbarHeight } from '../utils/navbarRect'
import { smoothScrollToElement } from '../utils/geometry'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import Medal from 'lucide-react/dist/esm/icons/medal'
import Star from 'lucide-react/dist/esm/icons/star'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import Download from 'lucide-react/dist/esm/icons/download'
import { assetUrl } from '../utils/assetUrl'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const achievements = [
  {
    title: 'Best Web Project of 2025',
    organization: 'Misr International University',
    description: 'Recognized for building an exceptional e-commerce platform with 3D configurator, payment integration, and comprehensive analytics.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    isHighlighted: true,
    website: 'https://vaultique.live',
  },
  {
    title: 'Semifinalist in DIGITOPIA 2025',
    organization: 'Digitopia Competition',
    description: 'Team reached semifinals with an innovative cybersecurity honeypot system capturing 500K+ SSH attack logs.',
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
    description: 'Received a recommendation letter from my internship supervisor.',
    icon: FileText,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    pdfUrl: '/Experience/NBE Letter of Recommendation.pdf',
    isHighlighted: true,
  },
  {
    title: 'Top Performer',
    organization: 'Multiple Internships',
    description: 'Consistently recognized as a top performer across internships at National Bank of Egypt, DEPI, ITIDA + GIGS program, and Fuzetek.',
    icon: Star,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    isHighlighted: true,
    showExperienceLink: true,
  }
]

export default function Achievements() {
  const { ref, isInView } = useInViewOnce()

  useEffect(() => {
    if (isInView && window.location.hash !== '#about') {
      window.history.replaceState(null, '', '#about')
    }
    }, [isInView])
  
  
  const navigate = useNavigate()
  const navbarHeightRef = useRef(getNavbarHeight() || 80)

  useEffect(() => {
    // Prefer ResizeObserver on the header to get size updates without
    // scheduling rAF-based reads/writes here which can cause forced reflows.
    let ro = null
    const header = typeof document !== 'undefined' ? document.querySelector('header') : null

    // initialize from shared helper (may schedule its own reads safely)
    navbarHeightRef.current = getNavbarHeight() || 80

    try {
      if (header && typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver((entries) => {
          if (!entries || !entries.length) return
          const entry = entries[0]
          if (entry.contentRect && entry.contentRect.height) {
            navbarHeightRef.current = entry.contentRect.height
          } else {
            // fallback: read from shared helper but defer to idle to avoid rAF contention
            if (typeof requestIdleCallback !== 'undefined') {
              requestIdleCallback(() => { navbarHeightRef.current = getNavbarHeight() || navbarHeightRef.current })
            } else {
              setTimeout(() => { navbarHeightRef.current = getNavbarHeight() || navbarHeightRef.current }, 100)
            }
          }
        })
        ro.observe(header)
      } else {
        // Fallback for environments without ResizeObserver: debounce reads on resize,
        // but defer actual reads to idle/setTimeout to avoid forcing layout during rAF.
        const onResize = () => {
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => { navbarHeightRef.current = getNavbarHeight() || navbarHeightRef.current })
          } else {
            setTimeout(() => { navbarHeightRef.current = getNavbarHeight() || navbarHeightRef.current }, 120)
          }
        }
        window.addEventListener('resize', onResize, { passive: true })
        return () => window.removeEventListener('resize', onResize)
      }
    } catch (e) {
      // ignore
    }

    return () => {
      try { if (ro) ro.disconnect() } catch (e) {}
    }
  }, [])
  
  const handleExperienceClick = (e) => {
    e.preventDefault()
    navigate('/#experience')
    // Smooth scroll to experience section after navigation
    // Defer to shared helper that batches layout reads; use cached navbar height
    const experienceSection = document.getElementById('experience')
    smoothScrollToElement(experienceSection, navbarHeightRef.current || 80, 16)
  }

  const handleProjectsClick = (e) => {
    e.preventDefault()
    navigate('/#projects')
    // Smooth scroll to projects section after navigation
    // Defer to shared helper that batches layout reads; use cached navbar height
    const projectsSection = document.getElementById('projects')
    smoothScrollToElement(projectsSection, navbarHeightRef.current || 80, 16)
  }

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
                  className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border-2 ${achievement.borderColor} ${achievement.bgColor} group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10 focus-visible:-translate-y-2 focus-visible:scale-[1.02] achievements-featured-item`}
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
                                onClick={handleExperienceClick}
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
                              onClick={handleExperienceClick}
                              className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                            >
                              View Experience
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            </a>
                          )}
                          {achievement.showProjectsLink && (
                            <a
                              href="/#projects"
                              onClick={handleProjectsClick}
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

          {/* Other Achievements */}
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.filter(a => !a.isHighlighted).map((achievement, index) => (
            <article
              key={achievement.title}
              style={{ ['--animation-delay']: `${index * 0.1 + 0.3}s` }}
              className={`relative glass-card p-6 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform hover:-translate-y-1 hover:scale-[1.01] focus-visible:-translate-y-1 focus-visible:scale-[1.01] achievements-other-item`}
              tabIndex={0}
              aria-labelledby={`achievement-other-${achievement.title.replace(/\s+/g, '-')}`}
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${achievement.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} aria-hidden="true" />
              
              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 shadow-lg`} aria-hidden="true">
                <achievement.icon className="w-7 h-7 text-dark-900" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 
                  id={`achievement-other-${achievement.title.replace(/\s+/g, '-')}`}
                  className="text-lg font-display font-bold text-foreground mb-2"
                >
                  {achievement.title}
                </h3>
                <p className="text-primary-500 font-medium text-sm mb-1">
                  {achievement.organization}
                </p>
                <div className="ach-project-placeholder mb-3">
                  {achievement.projectLink ? (
                    <a 
                      href={achievement.projectLink}
                      className="inline-flex items-center gap-1 text-muted text-sm hover:text-primary-500 transition-colors"
                    >
                      Project: {achievement.project}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-muted text-sm">
                      Project: {achievement.project}
                    </p>
                  )}
                </div>
                <p className="text-muted text-sm">
                  {achievement.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-3 right-3 opacity-10" aria-hidden="true">
                <achievement.icon className="w-16 h-16" />
              </div>
            </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}