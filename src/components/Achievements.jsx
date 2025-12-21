import { useInViewOnce } from '../utils/useInViewOnce'
import { Trophy, Medal, Star, ExternalLink, FileText, Download } from 'lucide-react'
import { assetUrl } from '../utils/assetUrl'
import { useNavigate } from 'react-router-dom'
import './Achievements.css'

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
  const navigate = useNavigate()
  
  const handleExperienceClick = (e) => {
    e.preventDefault()
    navigate('/#experience')
    // Smooth scroll to experience section after navigation
    setTimeout(() => {
      const experienceSection = document.getElementById('experience')
      if (experienceSection) {
        const navbar = document.querySelector('header')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80
        const elementRect = experienceSection.getBoundingClientRect()
        const elementTop = elementRect.top + window.scrollY
        const offset = navbarHeight + 16
        const targetScrollY = elementTop - offset
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleProjectsClick = (e) => {
    e.preventDefault()
    navigate('/#projects')
    // Smooth scroll to projects section after navigation
    setTimeout(() => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        const navbar = document.querySelector('header')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80
        const elementRect = projectsSection.getBoundingClientRect()
        const elementTop = elementRect.top + window.scrollY
        const offset = navbarHeight + 16
        const targetScrollY = elementTop - offset
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  return (
    <section 
      id="achievements" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="achievements-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-16 ${isInView ? 'animate-fade-in-scale' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" aria-hidden="true" />
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
          <div className={`mb-8 ${isInView ? 'animate-fade-in-scale animate-delay-2' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.filter(a => a.isHighlighted).map((achievement, index) => (
                <article
                  key={achievement.title}
                  ref={(el) => {
                    if (el) el.style.setProperty('--animation-delay', `${index * 0.15 + 0.2}s`)
                  }}
                  className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border-2 ${achievement.borderColor} ${achievement.bgColor} group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform hover:-translate-y-2 hover:scale-[1.02] focus-visible:-translate-y-2 focus-visible:scale-[1.02] achievements-featured-item ${isInView ? 'animate-fade-in-scale' : 'opacity-0'}`}
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
                    <p className="text-primary-400 font-medium text-sm mb-1">
                      {achievement.organization}
                    </p>
                    <p className="text-muted text-sm sm:text-base">
                      {achievement.description}
                    </p>

                    {(achievement.website || achievement.pdfUrl || achievement.showExperienceLink || achievement.showProjectsLink) && (
                      <div className="mt-5 flex flex-wrap gap-4">
                        {achievement.website && (
                          <a
                            href={achievement.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
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
                                  className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                                >
                                  <Download className="w-4 h-4" aria-hidden="true" />
                                  Download PDF
                                </a>
                              )
                            })()}
                            <a
                              href="/#experience"
                              onClick={handleExperienceClick}
                              className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
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
                            className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                          >
                            View Experience
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        )}
                        {achievement.showProjectsLink && (
                          <a
                            href="/#projects"
                            onClick={handleProjectsClick}
                            className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                          >
                            View Projects
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
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
              ref={(el) => {
                if (el) el.style.setProperty('--animation-delay', `${index * 0.1 + 0.3}s`)
              }}
              className={`relative glass-card p-6 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform hover:-translate-y-1 hover:scale-[1.01] focus-visible:-translate-y-1 focus-visible:scale-[1.01] achievements-other-item ${isInView ? 'animate-fade-in-scale' : 'opacity-0'}`}
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
                <p className="text-primary-400 font-medium text-sm mb-1">
                  {achievement.organization}
                </p>
                {achievement.projectLink ? (
                  <a 
                    href={achievement.projectLink}
                    className="inline-flex items-center gap-1 text-muted-foreground/60 text-sm mb-3 hover:text-primary-400 transition-colors"
                  >
                    Project: {achievement.project}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="text-muted-foreground/60 text-sm mb-3">
                    Project: {achievement.project}
                  </p>
                )}
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