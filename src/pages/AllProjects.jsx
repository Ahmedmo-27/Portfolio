
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Github, ChevronRight, Filter } from '../components/icons'
import batchSetProperty from '../utils/batchStyle'
import { observe } from '../utils/sharedObserver'
import CircuitBoard from '../components/CircuitBoard'
import ViewMoreButton from '../components/ViewMoreButton'
import MediaCarousel from '../components/MediaCarousel'
import { projects } from '../data/projects'
import '../components/Projects.css'

// Utility: Simple markdown bold parser (copied from Projects.jsx)
function parseBoldMarkdown(text) {
  if (!text) return '';
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'Full-Stack', label: 'Full-Stack' },
  { id: 'Backend', label: 'Backend' },
  { id: 'Android', label: 'Android' },
  { id: 'DevOps', label: 'DevOps' },
  { id: 'Security', label: 'Security' },
]

export default function AllProjects() {
  const navigate = useNavigate()
  // Use initialInView: true since this is a full page that starts at the top
  // This prevents redundancy and ensures content loads immediately on mobile
  const [activeProject, setActiveProject] = useState(null)
  const [mediaShouldLoad, setMediaShouldLoad] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')

  const projectItemElsRef = useRef({})
  const mediaObserverRef = useRef({})

  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Lazy load heavy media when the project card approaches viewport
  useEffect(() => {
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
    
    const cleanups = {}
    const observeCallback = (entry) => {
      if (!entry.isIntersecting) return
      const projectId = entry.target?.dataset?.projectId
      if (!projectId) return
      pendingUpdates.add(projectId)
      // shared observer with default once=true will unobserve for us
      if (pendingUpdates.size > 0 && !rafId) {
        rafId = requestAnimationFrame(processUpdates)
      }
    }

    for (const [projectId, el] of Object.entries(projectItemElsRef.current)) {
      if (el) {
        const cleanup = observe(el, observeCallback, { threshold: 0.1, rootMargin: '200px' })
        cleanups[projectId] = cleanup
      }
    }

    mediaObserverRef.current = cleanups
    // expose callback to ref-based observers added later
    mediaObserverRef.current._callback = observeCallback

    return () => {
      // run all cleanup functions
      for (const fn of Object.values(mediaObserverRef.current || {})) {
        try { fn() } catch (e) {}
      }
      mediaObserverRef.current = {}
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Back button - positioned at top left */}
      <div className="fixed top-20 left-4 sm:left-6 z-10">
        <button
          onClick={() => {
            // Navigate to home with projects hash - Navbar will handle highlighting and scrolling
            navigate('/#projects')
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover transition-colors duration-200 shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      <section 
        className="py-12 md:py-50 relative overflow-hidden"
        aria-labelledby="all-projects-heading"
      >
        {/* Background */}
        <CircuitBoard className="opacity-15" />
        <div className="tech-grid opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {/* Header */}
            <div className='text-center mb-16 mt-8 md:mt-0'>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-0 mt-12 md:mt-16">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
                All Projects
              </span>
              <h2 id="all-projects-heading" className="section-heading mb-6">
                All <span className="gradient-text">Projects</span>
              </h2>
              <p className="section-subheading mx-auto">
                A comprehensive showcase of all production-ready applications, award-winning projects, 
                and innovative solutions across various domains.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <div className="inline-flex items-center gap-2 text-muted text-sm">
                <Filter className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium">Filter:</span>
              </div>
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === category.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover'
                  }`}
                  aria-pressed={activeFilter === category.id}
                >
                  {category.label}
                  {activeFilter === category.id && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
                      {category.id === 'all' ? projects.length : projects.filter(p => p.category === category.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Projects Count */}
            <div className="text-center mb-8">
              <p className="text-muted text-sm">
                Showing <span className="text-primary-400 font-semibold">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>

            {/* Projects Grid */}
            <div 
              key={activeFilter}
              className="space-y-8 animate-fade-in-up" 
              role="list" 
              aria-label="Project list"
            >
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted text-lg">No projects found in this category.</p>
                </div>
              ) : (
                filteredProjects.map((project, index) => (
                <article
                  key={project.id}
                  data-project-id={project.id}
                  ref={(el) => {
                      if (el) {
                        batchSetProperty(el, '--animation-delay', `${index * 0.15 + 0.2}s`)
                        projectItemElsRef.current[project.id] = el
                        // create observer for this element and store cleanup
                        if (mediaObserverRef.current && mediaObserverRef.current._callback) {
                          const cleanup = observe(el, mediaObserverRef.current._callback, { threshold: 0.1, rootMargin: '200px' })
                          mediaObserverRef.current[project.id] = cleanup
                        }
                      } else {
                        delete projectItemElsRef.current[project.id]
                        if (mediaObserverRef.current && mediaObserverRef.current[project.id]) {
                          try { mediaObserverRef.current[project.id]() } catch (e) {}
                          delete mediaObserverRef.current[project.id]
                        }
                      }
                    }}
                  className={`${project.isHighlighted ? 'relative' : ''} projects-item `}
                  role="listitem"
                  aria-labelledby={`project-title-${project.id}`}
                >
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
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Media Section */}
                      <div className="relative bg-surface/50 p-4 sm:p-6">
                        <div className="aspect-video rounded-xl bg-surface overflow-hidden relative">
                          <MediaCarousel 
                            project={project} 
                            shouldLoad={index === 0 || mediaShouldLoad[project.id]} 
                          />
                        </div>

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
                      <div className="p-4 sm:p-6 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                              <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 id={`project-title-${project.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground line-clamp-2">
                                {project.title}
                              </h3>
                              <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-2">
                                {project.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted text-sm sm:text-base mb-3">
                          {project.description}
                        </p>

                        {/* Impact & Role - NEW (from Projects.jsx) */}
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

                        {/* Features Toggle (label and content updated for consistency) */}
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
              ))
              )}
            </div>

            {/* Footer CTA */}
            <div className='mt-12 text-center flex flex-col items-center gap-4'>
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
    </div>
  )
}
