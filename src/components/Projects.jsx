import { useRef, useState, useMemo, useEffect } from 'react'
import { ExternalLink, Github, ChevronRight, Gem, Shield, Smartphone, Globe, Terminal, FileText, Play, Download, ChevronUp } from 'lucide-react'
import CircuitBoard from './CircuitBoard'
import ViewMoreButton from './ViewMoreButton'
import './Projects.css'

const projects = [
  {
    id: 'vaultique',
    title: 'Vaultique',
    subtitle: 'E-Commerce Platform',
    description: 'Full-stack luxury watch e-commerce platform with payment integration, 3D configurator, CI/CD pipelines, and comprehensive analytics dashboard.',
    icon: Gem,
    color: 'from-amber-500 to-yellow-500',
    tech: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Three.js', 'Twilio', 'CI/CD'],
    features: [
      'Stripe payment integration',
      '3D watch configurator with Three.js',
      'Internal admin dashboards',
      'Real-time analytics',
      'SMS notifications via Twilio',
    ],
    links: {
      demo: 'https://vaultique.live',
      github: 'https://github.com/ahmedmo-27/Vaultique',
    },
    ctas: [
      { label: 'View Website', icon: ExternalLink, href: 'https://vaultique.live' },
      { label: 'View Source Code', icon: Github, href: 'https://github.com/ahmedmo-27/Vaultique' },
    ],
    award: 'Best Web Project of MIU 2025',
    isHighlighted: true,
    media: {
      screenshots: [
        '/Screenshot 2025-08-05 002942.png',
        '/Screenshot 2025-08-05 032735.png',
        '/Screenshot 2025-08-05 032859.png',
        '/Screenshot 2025-08-05 033035.png'
      ],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'cybertopia',
    title: 'Cybertopia',
    subtitle: 'Honeypot Platform (Digitopia 2025 Semifinalist)',
    description: 'Automated SSH honeypot system capturing 500K+ attack logs with OSINT enrichment and API exposure. Built for cybersecurity research and threat intelligence.',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    tech: ['Python', 'Cowrie', 'PostgreSQL', 'Node.js', 'DigitalOcean', 'OSINT APIs'],
    features: [
      'Cowrie SSH honeypot on DigitalOcean',
      '500K+ SSH attack logs captured',
      '300+ unique attackers identified',
      'OSINT API integration for threat intel',
      '3 REST APIs for data exposure',
    ],
    links: {
      demo: '#',
      github: 'https://github.com/CyberTopians/Cybertopia',
    },
    ctas: [
      { label: 'View Source Code', icon: Github, href: 'https://github.com/CyberTopians/Cybertopia' },
      { label: 'Documentation', icon: FileText, href: '#' },
    ],
    award: 'DIGITOPIA 2025 Semifinalist',
    isHighlighted: true,
    media: {
      screenshots: [],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'cinemeteor',
    title: 'Cinemeteor',
    subtitle: 'Android App (DEPI Capstone)',
    description: 'Jetpack Compose movie explorer application with TMDB API integration, featuring caching, reviews, similar movies, and smooth loading UX.',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Retrofit', 'Room', 'MVVM'],
    features: [
      'TMDB API integration',
      'Offline caching with Room',
      'Firebase Auth & Firestore',
      'Material Design 3 UI',
      'Movie reviews & similar movies',
    ],
    links: {
      demo: 'https://cinemeteor-5a5e0cee6735.herokuapp.com',
      github: '#',
    },
    ctas: [
      { label: 'Live Demo', icon: Play, href: 'https://cinemeteor-5a5e0cee6735.herokuapp.com' },
      { label: 'Download APK', icon: Download, href: '#' },
    ],
    award: 'DEPI Achiever Level Certificate',
    media: {
      screenshots: [],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'msp-miu',
    title: 'MSP-MIU Website',
    subtitle: 'Student Organization Portal',
    description: 'Official website for Microsoft Student Partners at MIU. Built with Node.js backend and MySQL database, deployed on DigitalOcean and Heroku.',
    icon: Globe,
    color: 'from-violet-500 to-purple-500',
    tech: ['Node.js', 'Express', 'MySQL', 'DigitalOcean', 'Heroku', 'Git'],
    features: [
      'Full-stack web application',
      'MySQL database on DigitalOcean',
      'Heroku deployment',
      'Git workflow with test/production branches',
      'Responsive design',
    ],
    links: {
      demo: 'https://msp-miu.tech',
      github: 'https://github.com/MSP-Tech-Club-MIU/MSP-MIU-Website',
    },
    ctas: [
      { label: 'View Website', icon: ExternalLink, href: 'https://msp-miu.tech' },
      { label: 'View Code', icon: Github, href: 'https://github.com/MSP-Tech-Club-MIU/MSP-MIU-Website' },
    ],
    media: {
      screenshots: [],
      video: null,
      presentation: null,
    },
  },
  {
    id: 'devops-tooling',
    title: 'NBE DevOps Scripts',
    subtitle: 'Automation Toolkit',
    description: 'Comprehensive automation toolkit for DevOps operations including disk automation, clean-up scripts, backup utilities, and Azure deployment pipelines.',
    icon: Terminal,
    color: 'from-blue-500 to-cyan-500',
    tech: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Linux'],
    features: [
      'Disk automation scripts',
      'System clean-up utilities',
      'Automated backup solutions',
      'Azure DevOps pipelines',
      'Production deployment automation',
    ],
    links: {
      github: '#',
    },
    ctas: [
      { label: 'View Scripts', icon: Github, href: '#' },
      { label: 'Documentation', icon: FileText, href: '#' },
    ],
    media: {
      screenshots: [],
      video: null,
      presentation: null,
    },
  },
]

export default function Projects() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [activeScreenshotIndex, setActiveScreenshotIndex] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: '-100px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])
  const [showAll, setShowAll] = useState(false)
  const initialDisplayCount = 2
  const displayedProjects = useMemo(() => {
    return showAll ? projects : projects.slice(0, initialDisplayCount)
  }, [showAll])

  return (
    <section 
      id="projects" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="projects-heading"
    >
      {/* Background */}
      <CircuitBoard className="opacity-15" />
      <div className="tech-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
              Projects
            </span>
            <h2 id="projects-heading" className="section-heading mb-6">
              Featured <span className="gradient-text">Work</span>
            </h2>
            <p className="section-subheading mx-auto">
              A showcase of production-ready applications, award-winning projects, 
              and innovative solutions across various domains.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-8" role="list" aria-label="Project list">
            {displayedProjects.map((project, index) => (
              <article
                key={project.id}
                ref={(el) => {
                  if (el) el.style.setProperty('--animation-delay', `${index * 0.15 + 0.2}s`)
                }}
                className={`${project.isHighlighted ? 'relative' : ''} projects-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                role="listitem"
                aria-labelledby={`project-title-${project.id}`}
              >
                {/* Highlighted badge for achievements */}
                {project.isHighlighted && (
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-amber text-dark-900 text-xs font-bold shadow-lg">
                      ⭐ Featured Project
                    </span>
                  </div>
                )}

                <div
                  className={`glass-card overflow-hidden group transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${project.isHighlighted ? 'ring-2 ring-accent-amber/30' : ''}`}
                  tabIndex={0}
                  role="article"
                >
                  <div className={`grid ${index === 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-2'} gap-0`}>
                    {/* Media Section */}
                    <div className={`${index === 0 ? 'lg:col-span-3' : ''} relative bg-surface/50 p-4 sm:p-6`}>
                      <div className="aspect-video rounded-xl bg-surface overflow-hidden relative">
                        {Array.isArray(project.media?.screenshots) && project.media.screenshots.length > 0 && (
                          <>
                            <img
                              src={
                                project.media.screenshots[
                                  activeScreenshotIndex[project.id] ?? 0
                                ]
                              }
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />

                            {project.media.screenshots.length > 1 && (
                              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
                                <button
                                  type="button"
                                  className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
                                  aria-label="Previous screenshot"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveScreenshotIndex((prev) => {
                                      const current = prev[project.id] ?? 0
                                      const total = project.media.screenshots.length
                                      const next = (current - 1 + total) % total
                                      return { ...prev, [project.id]: next }
                                    })
                                  }}
                                >
                                  ‹
                                </button>
                                <button
                                  type="button"
                                  className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
                                  aria-label="Next screenshot"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveScreenshotIndex((prev) => {
                                      const current = prev[project.id] ?? 0
                                      const total = project.media.screenshots.length
                                      const next = (current + 1) % total
                                      return { ...prev, [project.id]: next }
                                    })
                                  }}
                                >
                                  ›
                                </button>
                              </div>
                            )}

                            {project.media.screenshots.length > 1 && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {project.media.screenshots.map((_, i) => {
                                  const current = activeScreenshotIndex[project.id] ?? 0
                                  const isActive = i === current
                                  return (
                                    <button
                                      key={i}
                                      type="button"
                                      className={`h-1.5 rounded-full transition-all ${
                                        isActive ? 'w-5 bg-white' : 'w-2 bg-white/40'
                                      }`}
                                      aria-label={`Go to screenshot ${i + 1}`}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveScreenshotIndex((prev) => ({
                                          ...prev,
                                          [project.id]: i,
                                        }))
                                      }}
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )}

                        {(!Array.isArray(project.media?.screenshots) || project.media.screenshots.length === 0) && (
                          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                            <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                              <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-60" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Award Badge */}
                      {project.award && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/20 border border-accent-amber/30 text-accent-amber text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
                            🏆 <span className="hidden sm:inline">{project.award}</span>
                            <span className="sm:hidden">Award</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`${index === 0 ? 'lg:col-span-2' : ''} p-4 sm:p-6 flex flex-col`}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                            <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 id={`project-title-${project.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground truncate">
                              {project.title}
                            </h3>
                            <p className="text-primary-400 text-xs sm:text-sm font-medium truncate">
                              {project.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted text-sm sm:text-base mb-4 flex-grow">
                        {project.description}
                      </p>

                      {/* Features Toggle */}
                      <div className="mb-4">
                        <button
                          onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                          className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                          aria-expanded={activeProject === project.id}
                          aria-controls={`features-${project.id}`}
                        >
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${activeProject === project.id ? 'rotate-90' : ''}`} 
                            aria-hidden="true" 
                          />
                          Key Features
                        </button>
                        {activeProject === project.id && (
                          <ul
                            id={`features-${project.id}`}
                            className="mt-3 space-y-2 pl-6 animate-fade-in-up"
                            role="list"
                          >
                            {project.features.map((feature, i) => (
                              <li key={`${project.id}-feature-${i}`} className="flex items-start gap-2 text-muted text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" aria-hidden="true" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span key={tech} className="tech-tag text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                        {project.ctas.map((cta) => (
                          <a
                            key={cta.label}
                            href={cta.href}
                            target={cta.href.startsWith('http') ? '_blank' : undefined}
                            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="btn-cta"
                          >
                            <cta.icon className="w-4 h-4" aria-hidden="true" />
                            {cta.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View More Button */}
          <div
            className={`mt-12 text-center flex flex-col items-center gap-4 ${isInView ? 'animate-fade-in-up animate-delay-4' : 'opacity-0'}`}
          >
            {projects.length > initialDisplayCount && (
              <ViewMoreButton
                onClick={() => setShowAll(!showAll)}
                text={showAll ? 'Show Less' : 'View More Projects'}
                variant="outline"
                icon={showAll ? ChevronUp : undefined}
              />
            )}
            <ViewMoreButton
              href="https://github.com/ahmedmo-27"
              text="View All Projects on GitHub"
              variant="primary"
              icon={Github}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

