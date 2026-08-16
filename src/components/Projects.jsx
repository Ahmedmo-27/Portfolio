import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import Github from 'lucide-react/dist/esm/icons/github'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
import { useSectionReveal } from '../hooks/useSectionReveal'
const CircuitBoard = lazy(() => import('./CircuitBoard'))
import ViewMoreButton from './ViewMoreButton'
const MediaCarousel = lazy(() => import('./MediaCarousel'))
import { MediaSkeleton } from './SkeletonLoader'
import { projects } from '../data/projects'
import { useInViewOnce } from '../utils/useInViewOnce'
import { observe } from '../utils/sharedObserver'
import './Projects.css'

const featuredProject = projects[0]
const compactProjects = projects.slice(1, 3)

function parseBoldMarkdown(text) {
  if (!text) return ''
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function ProjectFeatures({ projectId, features, isOpen }) {
  const wrapRef = useRef(null)
  const innerRef = useRef(null)

  useGSAP(
    () => {
      const wrap = wrapRef.current
      const inner = innerRef.current
      if (!wrap || !inner) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set(wrap, { height: isOpen ? 'auto' : 0, autoAlpha: isOpen ? 1 : 0 })
        return
      }

      if (isOpen) {
        gsap.set(wrap, { height: 'auto', autoAlpha: 1 })
        const full = wrap.offsetHeight
        gsap.fromTo(
          wrap,
          { height: 0, autoAlpha: 0 },
          { height: full, autoAlpha: 1, duration: 0.4, ease: 'power2.out', onComplete: () => gsap.set(wrap, { height: 'auto' }) }
        )
        const items = gsap.utils.toArray('li', inner)
        if (items.length) {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.08 }
          )
        }
      } else {
        const current = wrap.offsetHeight
        if (current === 0) {
          gsap.set(wrap, { height: 0, autoAlpha: 0 })
          return
        }
        gsap.fromTo(
          wrap,
          { height: current, autoAlpha: 1 },
          { height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }
        )
      }
    },
    { dependencies: [isOpen], revertOnUpdate: false }
  )

  return (
    <div ref={wrapRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }} aria-hidden={!isOpen}>
      <ul
        ref={innerRef}
        id={`features-${projectId}`}
        className="mt-3 space-y-2 pl-6"
        role="list"
      >
        {features.map((feature, i) => (
          <li key={`${projectId}-feature-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" aria-hidden="true" />
            <span dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(feature) }} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Projects() {
  const { ref: inViewRef, isInView } = useInViewOnce()
  const [activeProject, setActiveProject] = useState(null)

  const [mediaShouldLoad, setMediaShouldLoad] = useState({})
  const projectItemElsRef = useRef({})
  const mediaObserverRef = useRef({})
  const pendingUpdatesRef = useRef(new Set())
  const processRafRef = useRef(null)

  const scopeRef = useSectionReveal({
    itemSelector: '.projects-item',
    stagger: 0.12,
    y: 36,
  })

  const setRefs = (node) => {
    scopeRef.current = node
    inViewRef.current = node
  }

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

  useEffect(() => {
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
        try {
          if (typeof fn === 'function') fn()
        } catch (e) {}
      }
      mediaObserverRef.current = {}
      pendingUpdatesRef.current.clear()
      if (processRafRef.current) cancelAnimationFrame(processRafRef.current)
      processRafRef.current = null
    }
  }, [isInView])

  const handleProjectRef = (projectId) => (el) => {
    if (el) {
      projectItemElsRef.current[projectId] = el

      if (isInView && mediaObserverRef.current && typeof mediaObserverRef.current._callback === 'function') {
        requestAnimationFrame(() => {
          if (!mediaObserverRef.current[projectId]) {
            try {
              const cleanup = observe(el, mediaObserverRef.current._callback, { threshold: 0.1, rootMargin: '200px' })
              mediaObserverRef.current[projectId] = cleanup
            } catch (e) {}
          }
        })
      }
    } else {
      delete projectItemElsRef.current[projectId]
      if (mediaObserverRef.current && mediaObserverRef.current[projectId]) {
        try {
          mediaObserverRef.current[projectId]()
        } catch (e) {}
        delete mediaObserverRef.current[projectId]
      }
    }
  }

  return (
    <section
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="projects-heading"
    >
      <Suspense fallback={<div aria-hidden="true" />}>
        <CircuitBoard className="opacity-15" />
      </Suspense>
      <div className="tech-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={setRefs}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
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

          <div className="space-y-6" role="list" aria-label="Project list">
            {/* Featured project — full card */}
            <article
              data-project-id={featuredProject.id}
              ref={handleProjectRef(featuredProject.id)}
              className={`${featuredProject.isHighlighted ? 'relative' : ''} projects-item gsap-reveal-item`}
              role="listitem"
              aria-labelledby={`project-title-${featuredProject.id}`}
            >
              {featuredProject.isHighlighted && (
                <div className="absolute -top-3 left-6 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-amber text-dark-900 text-xs font-bold shadow-lg">
                    Featured Project
                  </span>
                </div>
              )}

              <div className={`glass-card overflow-hidden group transition-transform hover:-translate-y-1 ${featuredProject.isHighlighted ? 'ring-2 ring-accent-amber/30' : ''}`}>
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 relative bg-surface/50 p-4 sm:p-6">
                    <div className="aspect-video rounded-xl bg-surface overflow-hidden relative">
                      <Suspense fallback={<MediaSkeleton className="w-full h-full" aria-hidden="true" />}>
                        <MediaCarousel
                          project={featuredProject}
                          shouldLoad={mediaShouldLoad[featuredProject.id] || false}
                        />
                      </Suspense>
                    </div>
                    {featuredProject.award && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/90 border border-accent-amber text-dark-900 text-[10px] sm:text-xs font-semibold backdrop-blur-sm shadow-lg">
                          Award · <span className="hidden sm:inline">{featuredProject.award}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2 p-4 sm:p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-3 min-w-0">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${featuredProject.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                        <featuredProject.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 id={`project-title-${featuredProject.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground truncate">
                          {featuredProject.title}
                        </h3>
                        <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-2">
                          {featuredProject.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted text-sm sm:text-base mb-3">{featuredProject.description}</p>

                    {(featuredProject.impact || featuredProject.role) && (
                      <div className="mb-4 space-y-2">
                        {featuredProject.impact && (
                          <div className="flex items-start gap-2 text-xs sm:text-sm">
                            <span className="text-accent-emerald font-semibold flex-shrink-0">Impact:</span>
                            <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(featuredProject.impact) }} />
                          </div>
                        )}
                        {featuredProject.role && (
                          <div className="flex items-start gap-2 text-xs sm:text-sm">
                            <span className="text-accent-cyan font-semibold flex-shrink-0">Role:</span>
                            <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(featuredProject.role) }} />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setActiveProject(activeProject === featuredProject.id ? null : featuredProject.id)}
                        className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                        aria-expanded={activeProject === featuredProject.id}
                        aria-controls={`features-${featuredProject.id}`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${activeProject === featuredProject.id ? 'rotate-90' : ''}`}
                          aria-hidden="true"
                        />
                        Technical Details
                      </button>
                      <ProjectFeatures
                        projectId={featuredProject.id}
                        features={featuredProject.features}
                        isOpen={activeProject === featuredProject.id}
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                      {featuredProject.tech.slice(0, 6).map((tech) => (
                        <span key={tech} className="tech-tag text-xs">{tech}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                      {featuredProject.ctas.map((cta) => {
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

            {/* Compact secondary projects — expand to full ProjectCard layout */}
            {compactProjects.map((project) => {
              const isExpanded = activeProject === project.id
              const openExpanded = () => {
                setActiveProject(project.id)
                setMediaShouldLoad((prev) => (prev[project.id] ? prev : { ...prev, [project.id]: true }))
              }

              return (
                <article
                  key={project.id}
                  data-project-id={project.id}
                  ref={handleProjectRef(project.id)}
                  className={`${project.isHighlighted ? 'relative' : ''} projects-item gsap-reveal-item`}
                  role="listitem"
                  aria-labelledby={`project-title-${project.id}`}
                >
                  {isExpanded && project.isHighlighted && (
                    <div className="absolute -top-3 left-6 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-amber text-dark-900 text-xs font-bold shadow-lg">
                        Featured Project
                      </span>
                    </div>
                  )}

                  {isExpanded ? (
                    <div
                      className={`glass-card overflow-hidden group transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${project.isHighlighted ? 'ring-2 ring-accent-amber/30' : ''}`}
                    >
                      <div className="grid lg:grid-cols-2 gap-0">
                        <div className="relative bg-surface/50 p-4 sm:p-6">
                          <div className="aspect-video rounded-xl bg-surface overflow-hidden relative">
                            <Suspense fallback={<MediaSkeleton className="w-full h-full" aria-hidden="true" />}>
                              <MediaCarousel
                                project={project}
                                shouldLoad={mediaShouldLoad[project.id] || false}
                              />
                            </Suspense>
                          </div>
                          {project.award && (
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/90 border border-accent-amber text-dark-900 text-[10px] sm:text-xs font-semibold backdrop-blur-sm shadow-lg">
                                Award · <span className="hidden sm:inline">{project.award}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 sm:p-6 flex flex-col">
                          <div className="flex items-center gap-3 mb-4 min-w-0">
                            <div
                              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                              aria-hidden="true"
                            >
                              <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3
                                id={`project-title-${project.id}`}
                                className="text-lg sm:text-xl font-display font-bold text-foreground line-clamp-2"
                              >
                                {project.title}
                              </h3>
                              <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-2">
                                {project.subtitle}
                              </p>
                            </div>
                          </div>

                          <p className="text-muted text-sm sm:text-base mb-3">{project.description}</p>

                          {(project.impact || project.role) && (
                            <div className="mb-4 space-y-2">
                              {project.impact && (
                                <div className="flex items-start gap-2 text-xs sm:text-sm">
                                  <span className="text-accent-emerald font-semibold flex-shrink-0">Impact:</span>
                                  <span
                                    className="text-muted"
                                    dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.impact) }}
                                  />
                                </div>
                              )}
                              {project.role && (
                                <div className="flex items-start gap-2 text-xs sm:text-sm">
                                  <span className="text-accent-cyan font-semibold flex-shrink-0">Role:</span>
                                  <span
                                    className="text-muted"
                                    dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.role) }}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="mb-4">
                            <button
                              type="button"
                              onClick={() => setActiveProject(null)}
                              className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                              aria-expanded
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" aria-hidden="true" />
                              Hide details
                            </button>
                            <ul className="mt-3 space-y-2 pl-6" role="list">
                              {project.features.map((feature, i) => (
                                <li
                                  key={`${project.id}-feature-${i}`}
                                  className="flex items-start gap-2 text-muted text-xs sm:text-sm"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(feature) }} />
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto mb-3">
                            {project.tech.map((tech) => (
                              <span key={tech} className="tech-tag text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>

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
                  ) : (
                    <div className="glass-card overflow-hidden transition-transform hover:-translate-y-0.5">
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          aria-hidden="true"
                        >
                          <project.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            id={`project-title-${project.id}`}
                            className="text-base sm:text-lg font-display font-bold text-foreground truncate"
                          >
                            {project.title}
                          </h3>
                          <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-1">
                            {project.subtitle}
                          </p>
                          <p className="text-muted text-xs sm:text-sm mt-1 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.tech.slice(0, 4).map((tech) => (
                              <span key={tech} className="tech-tag text-[10px] sm:text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch flex-shrink-0">
                          {project.ctas.slice(0, 1).map((cta) => {
                            const Icon = cta.icon
                            return (
                              <a
                                key={cta.label}
                                href={cta.href}
                                target={cta.href.startsWith('http') ? '_blank' : undefined}
                                rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="btn-cta text-xs sm:text-sm"
                              >
                                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                                {cta.label}
                              </a>
                            )
                          })}
                          <ViewMoreButton
                            onClick={openExpanded}
                            text="Details"
                            variant="outline"
                            icon={ChevronRight}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          <div className="mt-10 text-center flex flex-col items-center gap-3">
            <ViewMoreButton to="/projects" text="View All Projects" variant="outline" />
            <ViewMoreButton
              href="https://github.com/ahmedmo-27"
              text="GitHub"
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
