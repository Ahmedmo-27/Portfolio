import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import batchSetProperty from '../utils/batchStyle'
import Github from 'lucide-react/dist/esm/icons/github'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import CircuitBoard from './CircuitBoard'
import ViewMoreButton from './ViewMoreButton'
const MediaCarousel = lazy(() => import('./MediaCarousel'))
import { MediaSkeleton } from './SkeletonLoader'
import { projects } from '../data/projects'
import { useInViewOnce } from '../utils/useInViewOnce'
import { observe } from '../utils/sharedObserver'
import './Projects.css'

// Keep only first 3 projects for the home page
const initialDisplayCount = 3
const displayedProjects = projects.slice(0, initialDisplayCount)

// Utility: Simple markdown bold parser
function parseBoldMarkdown(text) {
  if (!text) return '';
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

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
  const mediaObserverRef = useRef({})
  const pendingUpdatesRef = useRef(new Set())
  const processRafRef = useRef(null)

  // schedule processing of pending updates in a single rAF
  const scheduleProcess = () => {
    if (processRafRef.current != null) return
    processRafRef.current = requestAnimationFrame(() => {
      processRafRef.current = null
      const pending = pendingUpdatesRef.current
      if (pending.size === 0) return
      setMediaShouldLoad((prev) => {
        const updates = {}
        let hasChanges = false
        for (const projectId of pending) {
          if (!prev[projectId]) {
            updates[projectId] = true
            hasChanges = true
          }
        }
        return hasChanges ? { ...prev, ...updates } : prev
      })
      pending.clear()
    })
  }

  const observeCallback = (entry) => {
    if (!entry.isIntersecting) return
    const projectId = entry.target?.dataset?.projectId
    if (!projectId) return
    pendingUpdatesRef.current.add(projectId)
    scheduleProcess()
  }

  // Lazy load heavy media when the project card approaches viewport
  // Only start observing after the section is in view to avoid unnecessary work
  useEffect(() => {
    // Don't set up observer until section is in view
    if (!isInView) return

    const cleanups = {}
    const elements = Object.values(projectItemElsRef.current)
    for (const el of elements) {
      if (el) {
        const cleanup = observe(el, observeCallback, { threshold: 0.1, rootMargin: '200px' })
        cleanups[el.dataset?.projectId] = cleanup
      }
    }
    mediaObserverRef.current = cleanups
    mediaObserverRef.current._callback = observeCallback

    return () => {
      for (const fn of Object.values(mediaObserverRef.current || {})) {
        try { fn() } catch (e) {}
      }
      mediaObserverRef.current = {}
      pendingUpdatesRef.current.clear()
      if (processRafRef.current) cancelAnimationFrame(processRafRef.current)
      processRafRef.current = null
    }
  }, [isInView])

  // Stable ref callback to register/unregister project item elements
  const handleProjectRef = (projectId, delay) => (el) => {
    if (el) {
      batchSetProperty(el, '--animation-delay', delay)
      projectItemElsRef.current[projectId] = el

      // If section already in view, schedule observer registration inside rAF
      if (isInView && mediaObserverRef.current && typeof mediaObserverRef.current._callback === 'function') {
        requestAnimationFrame(() => {
          // Avoid double-registering
          if (!mediaObserverRef.current[projectId]) {
            try {
              const cleanup = observe(el, mediaObserverRef.current._callback, { threshold: 0.1, rootMargin: '200px' })
              mediaObserverRef.current[projectId] = cleanup
            } catch (e) {
              // ignore observer errors
            }
          }
        })
      }
    } else {
      delete projectItemElsRef.current[projectId]
      if (mediaObserverRef.current && mediaObserverRef.current[projectId]) {
        try { mediaObserverRef.current[projectId]() } catch (e) {}
        delete mediaObserverRef.current[projectId]
      }
    }
  }

  return (
    <section 
      id="projects" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="projects-heading"
    >
      {/* Background */}
      <CircuitBoard className="opacity-15" />
      <div className="tech-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/20 border border-accent-violet/30 text-accent-violet text-sm font-medium mb-4">
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
                    ref={handleProjectRef(project.id, `${index * 0.15 + 0.2}s`)}
                className={`${project.isHighlighted ? 'relative' : ''} projects-item animate-fade-in-up`}
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
                        <Suspense fallback={<MediaSkeleton className="w-full h-full" aria-hidden="true" />}>
                          <MediaCarousel 
                            project={project} 
                            shouldLoad={mediaShouldLoad[project.id] || false} 
                          />
                        </Suspense>
                      </div>

                      {/* Award Badge */}
                      {project.award && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/90 border border-accent-amber text-dark-900 text-[10px] sm:text-xs font-semibold backdrop-blur-sm shadow-lg">
                            🏆 <span className="hidden sm:inline">{project.award}</span>
                            <span className="sm:hidden">Award</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`${index === 0 ? 'lg:col-span-2' : ''} p-4 sm:p-6 flex flex-col`}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                            <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 id={`project-title-${project.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground truncate">
                              {project.title}
                            </h3>
                            <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-2">
                              {project.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted text-sm sm:text-base mb-3">
                        {project.description}
                      </p>

                      {/* Impact & Role - NEW */}
                      {(project.impact || project.role) && (
                        <div className="mb-4 space-y-2">
                          {project.impact && (
                            <div className="flex items-start gap-2 text-xs sm:text-sm">
                              <span className="text-accent-emerald font-semibold flex-shrink-0">Impact:</span>
                              <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.impact) }} />
                            </div>
                          )}
                          {project.role && (
                            <div className="flex items-start gap-2 text-xs sm:text-sm">
                              <span className="text-accent-cyan font-semibold flex-shrink-0">Role:</span>
                              <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.role) }} />
                            </div>
                          )}
                        </div>
                      )}

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
                          Technical Details
                        </button>
                        {activeProject === project.id && (
                          <ul
                            id={`features-${project.id}`}
                            className="mt-3 space-y-2 pl-6 animate-fade-in-up"
                            role="list"
                          >
                            {project.features.map((feature, i) => (
                              <li key={`${project.id}-feature-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" aria-hidden="true" />
                                <span dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(feature) }} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto mb-3">
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
                          // Determine link type from label
                          const linkType = cta.label.toLowerCase().includes('website') || cta.label.toLowerCase().includes('demo') 
                            ? 'demo' 
                            : cta.label.toLowerCase().includes('source') || cta.label.toLowerCase().includes('github')
                            ? 'github'
                            : 'other'
                          
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
            className='mt-12 text-center flex flex-col items-center gap-4'
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
