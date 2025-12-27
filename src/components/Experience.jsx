import { useState, useMemo, useEffect } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Code from 'lucide-react/dist/esm/icons/code'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import MapPin from 'lucide-react/dist/esm/icons/map-pin'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import { assetUrl } from '../utils/assetUrl'
import { useInViewOnce } from '../utils/useInViewOnce'

const experiences = [
  {
    company: 'National Bank of Egypt (NBE)',
    role: 'Live Environment Support — DevOps & Automation Intern',
    period: 'Jul 2025 – Aug 2025',
    location: 'Giza, Egypt',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    highlights: [
      'Built Bash/PowerShell automation toolkit used by DevOps team',
      'Automated deployment pipelines on Azure DevOps for core banking systems',
      'Worked closely with UAT & production systems',
      'Improved deployment reliability for mission-critical operations',
    ],
    tags: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Automation'],
    documents: [{ label: 'Recommendation Letter (PDF)', href: '/Experience/NBE Letter of Recommendation.pdf' }],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/NBE.jpg' }],
  },
  {
    company: 'DEPI – Digital Egyptian Pioneers Initiative',
    role: 'Android Mobile App Developer',
    period: 'Jun 2025 – Dec 2025',
    location: 'Hybrid (Cairo, Egypt)',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    highlights: [
      'Developed Android apps using Kotlin, Jetpack Compose, Room, Retrofit',
      'Worked on Cinemeteor capstone project',
      'Implemented TMDB API handling, caching, reviews, similar movies, and loading UX',
      'Contributed to Firebase integration, testing, documentation',
      'Awarded Achiever Level Certificate',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Firebase', 'XML'],
    // documents: [{ label: 'Completion Certificate', href: '/certificates/depi-certificate.pdf' }],
  },
  {
    company: 'Fuzetek',
    role: 'Software Engineering Intern',
    period: 'Feb 2025 – Apr 2025',
    location: 'Remote',
    icon: Cpu,
    color: 'from-indigo-500 to-blue-500',
    highlights: [
      'Ranked in the top 5% among 300+ interns',
      'Solved 50+ problems in Python and C++',
      'Participated in coding sessions, debugging, and testing tasks',
      'Worked across small development projects',
    ],
    tags: ['Python', 'C++', 'Problem Solving', 'Debugging', 'Testing'],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/Fuzetek.jpg' }],
    documents: [{ label: 'Achiever Post', href: '/Experience/Achiever Post.png' }],
  },
  {
    company: 'ITIDA Gigs Freelancing Program',
    role: 'Freelance Software Tester',
    period: 'Feb 2025 – May 2025',
    location: 'Remote',
    icon: Code,
    color: 'from-orange-500 to-amber-500',
    highlights: [
      'Worked hands-on with Selenium, automation frameworks',
      'Tested Node.js APIs using Postman',
      'Logged and tracked defects professionally',
      'Gained freelance & personal branding skillset',
    ],
    tags: ['Selenium', 'Postman', 'API Testing', 'Automation', 'QA'],
    documents: [{ label: 'Program Certificate', href: '/Experience/ITIDA + GIGS.jpg' }],
  }]

export default function Experience() {
  const { ref, isInView } = useInViewOnce()
  const [showAll, setShowAll] = useState(false)

  // Update URL hash when section comes into view
  useEffect(() => {
    if (isInView && window.location.hash !== '#experience') {
      window.history.replaceState(null, '', '#experience')
    }
  }, [isInView])

  const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  const initialDisplayCount = 4
  const displayedExperiences = useMemo(() => {
    return showAll ? experiences : experiences.slice(0, initialDisplayCount)
  }, [showAll])

  return (
    <section 
      id="experience" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className= 'text-center mb-12 md:mb-16'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden="true" />
              Experience
            </span>
            <h2 id="experience-heading" className="section-heading mb-6">
              Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subheading mx-auto">
              A track record of impactful contributions across internships, 
              freelance projects, and academic achievements.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative" role="list" aria-label="Work experience timeline">
                  <div 
                    className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-emerald transform md:-translate-x-1/2" 
                    aria-hidden="true" 
                  />

                  {/* Experience Items */}
                  <div className="space-y-8 md:space-y-12">
                    {displayedExperiences.map((exp, index) => (
                    <article
                      key={exp.company}
                      ref={(el) => {
                      if (el) el.style.setProperty('--animation-delay', `${index * 0.15 + 0.2}s`)
                      }}
                      className={`relative flex flex-col md:flex-row gap-6 md:gap-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      } experience-item animate-fade-in-left`}
                      role="listitem"
                      aria-labelledby={`exp-title-${index}`}
                    >
                      {/* Timeline Dot */}
                  <div 
                    className="absolute left-4 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-card border-2 border-primary-500 transform -translate-x-1/2 z-10" 
                    aria-hidden="true" 
                  />

                  {/* Content Card */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 lg:pr-12' : 'md:pl-8 lg:pl-12'} pl-10 md:pl-0`}>
                    <div
                      className="glass-card p-4 sm:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1"
                      tabIndex={0}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        <div 
                          className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          aria-hidden="true"
                        >
                          <exp.icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            id={`exp-title-${index}`}
                            className="text-base sm:text-lg md:text-xl font-display font-semibold text-foreground mb-1 leading-tight break-words"
                          >
                            {exp.company}
                          </h3>
                          <p className="text-primary-400 font-medium text-xs sm:text-sm">
                            {exp.role}
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 md:gap-4 mb-3 md:mb-4 text-xs sm:text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary-400" aria-hidden="true" />
                          <time>{exp.period}</time>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-accent-cyan" aria-hidden="true" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-1.5 md:space-y-2 mb-3 md:mb-4" role="list">
                        {exp.highlights.map((highlight, i) => (
                          <li key={`${exp.company}-highlight-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 md:mt-2 flex-shrink-0" aria-hidden="true" />
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="tech-tag text-[10px] sm:text-xs" role="listitem">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Certificate / Documents (supports multiple files) */}
                      {(() => {
                        const attachments = [
                          ...toArray(exp.documents),
                          ...toArray(exp.certificate),
                        ].filter(Boolean)

                        if (attachments.length === 0) return null

                        return (
                        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/60">
                          <p className="text-xs font-semibold text-foreground mb-2">
                            Certificate / Documents
                          </p>
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
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-border px-2.5 py-1.5 text-[11px] text-primary-400 hover:text-primary-300 hover:border-primary-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                >
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

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

