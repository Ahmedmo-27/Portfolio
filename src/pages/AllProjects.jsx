import { useRef, useState, useEffect, lazy, Suspense, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'
import Github from 'lucide-react/dist/esm/icons/github'
import Filter from 'lucide-react/dist/esm/icons/filter'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
import { observe } from '../utils/sharedObserver'
const CircuitBoard = lazy(() => import('../components/CircuitBoard'))
import ViewMoreButton from '../components/ViewMoreButton'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import '../components/Projects.css'

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'Full-Stack', label: 'Full-Stack' },
  { id: 'Android', label: 'Android' },
  { id: 'DevOps', label: 'DevOps' },
  { id: 'Security', label: 'Security' },
]

export default function AllProjects() {
  const navigate = useNavigate()
  const [activeProject, setActiveProject] = useState(null)
  const [mediaShouldLoad, setMediaShouldLoad] = useState({})
  const [activeFilter, setActiveFilter] = useState('all')

  const listRef = useRef(null)
  const projectItemElsRef = useRef({})
  const mediaObserverRef = useRef({})
  const pendingUpdatesRef = useRef(new Set())
  const processRafRef = useRef(null)

  const filteredProjects =
    activeFilter === 'all' ? projects : projects.filter((project) => project.category === activeFilter)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.projects-item', listRef.current)
      if (!items.length) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(items, { autoAlpha: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          y: 20,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
        })
      })

      return () => mm.revert()
    },
    { scope: listRef, dependencies: [activeFilter], revertOnUpdate: true }
  )

  const scheduleProcess = useCallback(() => {
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
  }, [])

  const observeCallback = useCallback(
    (entry) => {
      if (!entry.isIntersecting) return
      const projectId = entry.target?.dataset?.projectId
      if (!projectId) return
      pendingUpdatesRef.current.add(projectId)
      scheduleProcess()
    },
    [scheduleProcess]
  )

  useEffect(() => {
    const cleanups = {}
    for (const [projectId, el] of Object.entries(projectItemElsRef.current)) {
      if (el) {
        cleanups[projectId] = observe(el, observeCallback, { threshold: 0.1, rootMargin: '200px' })
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
  }, [activeFilter, observeCallback, filteredProjects.length])

  const handleProjectRef = (projectId) => (el) => {
    if (el) {
      projectItemElsRef.current[projectId] = el
      if (mediaObserverRef.current && typeof mediaObserverRef.current._callback === 'function') {
        requestAnimationFrame(() => {
          if (!mediaObserverRef.current[projectId]) {
            try {
              const cleanup = observe(el, mediaObserverRef.current._callback, {
                threshold: 0.1,
                rootMargin: '200px',
              })
              mediaObserverRef.current[projectId] = cleanup
            } catch (e) {}
          }
        })
      }
    } else {
      delete projectItemElsRef.current[projectId]
      if (mediaObserverRef.current?.[projectId]) {
        try {
          mediaObserverRef.current[projectId]()
        } catch (e) {}
        delete mediaObserverRef.current[projectId]
      }
    }
  }

  const goHomeProjects = () => {
    navigate('/')
    requestAnimationFrame(() => {
      const el = document.getElementById('projects')
      if (el) {
        const nav = document.querySelector('nav')
        const offset = nav ? nav.getBoundingClientRect().height + 16 : 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
        window.history.replaceState(null, '', '#projects')
      }
    })
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-20 left-4 sm:left-6 z-10">
        <button
          type="button"
          onClick={goHomeProjects}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover transition-colors duration-200 shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      <section className="py-12 md:py-24 relative overflow-hidden" aria-labelledby="all-projects-heading">
        <Suspense fallback={<div aria-hidden="true" />}>
          <CircuitBoard className="opacity-15" />
        </Suspense>
        <div className="tech-grid opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 mt-8 md:mt-0">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-0 mt-12 md:mt-16">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
              All Projects
            </span>
            <h2 id="all-projects-heading" className="section-heading mb-6">
              All <span className="gradient-text">Projects</span>
            </h2>
            <p className="section-subheading mx-auto">
              A comprehensive showcase of all production-ready applications, award-winning projects, and innovative
              solutions across various domains.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="inline-flex items-center gap-2 text-muted text-sm">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium">Filter:</span>
            </div>
            {FILTER_CATEGORIES.map((category) => {
              const count =
                category.id === 'all' ? projects.length : projects.filter((p) => p.category === category.id).length
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeFilter === category.id
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover'
                  }`}
                  aria-pressed={activeFilter === category.id}
                >
                  {category.label}
                  {activeFilter === category.id && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="text-center mb-8">
            <p className="text-muted text-sm">
              Showing <span className="text-primary-400 font-semibold">{filteredProjects.length}</span>{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          <div ref={listRef} key={activeFilter} className="space-y-8" role="list" aria-label="Project list">
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
                  registerRef={handleProjectRef}
                />
              ))
            )}
          </div>

          <div className="mt-12 text-center flex flex-col items-center gap-4">
            <ViewMoreButton
              href="https://github.com/ahmedmo-27"
              text="View All Projects on GitHub"
              variant="primary"
              icon={Github}
              target="_blank"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
