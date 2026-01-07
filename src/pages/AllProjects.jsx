
import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'
import Github from 'lucide-react/dist/esm/icons/github'
import Filter from 'lucide-react/dist/esm/icons/filter'
import { observe } from '../utils/sharedObserver'
const CircuitBoard = lazy(() => import('../components/CircuitBoard'))
import ViewMoreButton from '../components/ViewMoreButton'
import ProjectCard from '../components/ProjectCard'
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
        <Suspense fallback={<div aria-hidden="true" />}>
          <CircuitBoard className="opacity-15" />
        </Suspense>
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
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    mediaShouldLoad={mediaShouldLoad}
                    activeProject={activeProject}
                    setActiveProject={setActiveProject}
                  />
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
