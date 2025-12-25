import { useRef, useState, useEffect } from 'react'
import Github from 'lucide-react/dist/esm/icons/github'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import CircuitBoard from './CircuitBoard'
import ViewMoreButton from './ViewMoreButton'
import MediaCarousel from './MediaCarousel'
import { projects } from '../data/projects'
import { useInViewOnce } from '../utils/useInViewOnce'
import './Projects.css'

// Keep only first 3 projects for the home page
const initialDisplayCount = 3
const displayedProjects = projects.slice(0, initialDisplayCount)

export default function Projects() {
  const { ref, isInView } = useInViewOnce()
  const [activeProject, setActiveProject] = useState(null)

  // Update URL hash when section comes into view
  useEffect(() => {
    if (isInView && window.location.hash !== '#projects') {
      window.history.replaceState(null, '', '#projects')
    }
  }, [isInView])
  const [mediaShouldLoad, setMediaShouldLoad] = useState({}) // projectId -> boolean
  const projectItemElsRef = useRef({}) // projectId -> HTMLElement
  const mediaObserverRef = useRef(null)

  // Lazy load heavy media when the project card approaches viewport
  // Only start observing after the section is in view to avoid unnecessary work
  useEffect(() => {
    // Don't set up observer until section is in view
    if (!isInView) return

    let pendingUpdates = new Set()
    let rafId = null
    
    const processUpdates = () => {
      if (pendingUpdates.size > 0) {
        setMediaShouldLoad((prev) => {
          const updates = {}
          let hasChanges = false
          for (const projectId of pendingUpdates) {
            if (!prev[projectId]) {
              updates[projectId] = true
              hasChanges = true
            }
          }
          return hasChanges ? { ...prev, ...updates } : prev
        })
        pendingUpdates.clear()
      }
      rafId = null
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const projectId = entry.target?.dataset?.projectId
          if (!projectId) continue
          pendingUpdates.add(projectId)
          observer.unobserve(entry.target)
        }
        
        // Batch updates using requestAnimationFrame for better performance
        if (pendingUpdates.size > 0 && !rafId) {
          rafId = requestAnimationFrame(processUpdates)
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    mediaObserverRef.current = observer
    
    // Observe all existing project elements
    const elements = Object.values(projectItemElsRef.current)
    for (const el of elements) {
      if (el) {
        observer.observe(el)
        // Check if element is already in viewport (for immediate load)
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200
        if (isVisible) {
          const projectId = el.dataset?.projectId
          if (projectId) {
            pendingUpdates.add(projectId)
          }
        }
      }
    }

    // Process any immediately visible elements
    if (pendingUpdates.size > 0) {
      rafId = requestAnimationFrame(processUpdates)
    }

    return () => {
      observer.disconnect()
      mediaObserverRef.current = null
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isInView])

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
                data-project-id={project.id}
                ref={(el) => {
                  if (el) {
                    el.style.setProperty('--animation-delay', `${index * 0.15 + 0.2}s`)
                    projectItemElsRef.current[project.id] = el
                    if (mediaObserverRef.current) mediaObserverRef.current.observe(el)
                  } else {
                    delete projectItemElsRef.current[project.id]
                  }
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
                        <MediaCarousel 
                          project={project} 
                          shouldLoad={mediaShouldLoad[project.id] || false} 
                        />
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
                      <p className="text-muted text-sm sm:text-base mb-4">
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
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-10 mb-3">
                        {project.tech.map((tech) => (
                          <span key={tech} className="tech-tag text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                        {project.ctas.map((cta) => {
                          const Icon = cta.icon
                          return (
                            <a
                              key={cta.label}
                              href={cta.href}
                              target={cta.href.startsWith('http') ? '_blank' : undefined}
                              rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="btn-cta"
                            >
                              <Icon className="w-4 h-4" aria-hidden="true" />
                              {cta.label}
                            </a>
                          )
                        })}
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
                to="/projects"
                text="View All Projects"
                variant="outline"
              />
            )}
            <ViewMoreButton
              href="https://github.com/ahmedmo-27"
              text="View All Projects on GitHub"
              variant="primary"
              icon={Github}
              target="_blank"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
