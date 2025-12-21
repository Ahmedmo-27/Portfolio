import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Github, ChevronRight, FileText } from 'lucide-react'
import CircuitBoard from '../components/CircuitBoard'
import ViewMoreButton from '../components/ViewMoreButton'
import { projects } from '../data/projects'
import { assetUrl } from '../utils/assetUrl'
import { useInViewOnce } from '../utils/useInViewOnce'
import '../components/Projects.css'

export default function AllProjects() {
  const navigate = useNavigate()
  // Use initialInView: true since this is a full page that starts at the top
  // This prevents redundancy and ensures content loads immediately on mobile
  const { ref, isInView } = useInViewOnce({ initialInView: true, rootMargin: '0px' })
  const [activeProject, setActiveProject] = useState(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState({})
  const [portraitVideos, setPortraitVideos] = useState({})
  const [mediaShouldLoad, setMediaShouldLoad] = useState({})
  const [csvPreviewData, setCsvPreviewData] = useState({})
  const [csvPreviewStatus, setCsvPreviewStatus] = useState({})
  const [csvSearch, setCsvSearch] = useState({})

  const projectItemElsRef = useRef({})
  const mediaObserverRef = useRef(null)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const projectId = entry.target?.dataset?.projectId
          if (!projectId) continue
          setMediaShouldLoad((prev) => (prev[projectId] ? prev : { ...prev, [projectId]: true }))
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    mediaObserverRef.current = observer
    for (const el of Object.values(projectItemElsRef.current)) {
      if (el) observer.observe(el)
    }

    return () => {
      observer.disconnect()
      mediaObserverRef.current = null
    }
  }, [])

  const fileExt = (src) => {
    if (!src || typeof src !== 'string') return ''
    const withoutQuery = src.split('?')[0]
    const lastDot = withoutQuery.lastIndexOf('.')
    if (lastDot === -1) return ''
    return withoutQuery.slice(lastDot + 1).toLowerCase()
  }

  const detectDelimiter = (text) => {
    const sample = (text || '').split(/\r?\n/).slice(0, 5).join('\n')
    const candidates = [',', ';', '\t', '|']
    let best = ','
    let bestScore = -1
    for (const d of candidates) {
      const score = (sample.match(new RegExp(`\\${d}`, 'g')) || []).length
      if (score > bestScore) {
        bestScore = score
        best = d
      }
    }
    return best
  }

  const parseCsv = (text, delimiter, maxRows = 30, maxCols = 20) => {
    const rows = []
    let row = []
    let field = ''
    let inQuotes = false

    const pushField = () => {
      row.push(field)
      field = ''
    }

    const pushRow = () => {
      while (row.length && row[row.length - 1] === '') row.pop()
      rows.push(row.slice(0, maxCols))
      row = []
    }

    for (let i = 0; i < text.length; i++) {
      const c = text[i]
      if (inQuotes) {
        if (c === '"') {
          const next = text[i + 1]
          if (next === '"') {
            field += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          field += c
        }
      } else {
        if (c === '"') {
          inQuotes = true
        } else if (c === delimiter) {
          pushField()
        } else if (c === '\n') {
          pushField()
          pushRow()
          if (rows.length >= maxRows) break
        } else if (c === '\r') {
          // ignore \r
        } else {
          field += c
        }
      }
    }

    if (rows.length < maxRows) {
      pushField()
      if (row.some((x) => x !== '')) pushRow()
    }

    const header = rows.length > 0 ? rows[0].map((h) => (h || '').trim()) : []
    const bodyRows = rows.length > 1 ? rows.slice(1) : []
    return { header, rows: bodyRows }
  }

  const getGalleryItems = (project) => {
    const items = []

    if (Array.isArray(project.media?.screenshots)) {
      for (const src of project.media.screenshots) {
        if (src) items.push({ type: 'image', src })
      }
    }

    if (project.media?.video) {
      items.push({ type: 'video', src: project.media.video })
    }

    if (Array.isArray(project.media?.presentation)) {
      for (const src of project.media.presentation) {
        if (!src) continue
        const ext = fileExt(src)
        if (ext === 'pdf') items.push({ type: 'pdf', src })
        else if (ext === 'csv') items.push({ type: 'csv', src })
        else items.push({ type: 'file', src })
      }
    } else if (project.media?.presentation) {
      const src = project.media.presentation
      const ext = fileExt(src)
      if (ext === 'pdf') items.push({ type: 'pdf', src })
      else if (ext === 'csv') items.push({ type: 'csv', src })
      else items.push({ type: 'file', src })
    }

    return items
  }

  return (
    <div className="min-h-screen">
      {/* Back button - positioned at top left */}
      <div className="fixed top-20 left-4 sm:left-6 z-10">
        <button
          onClick={() => {
            navigate('/')
            // Wait for navigation and DOM update, then scroll to projects section
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const projectsSection = document.getElementById('projects')
                if (projectsSection) {
                  const navbar = document.querySelector('header')
                  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : (window.innerWidth >= 768 ? 80 : 70)
                  const offset = navbarHeight + 16
                  const elementRect = projectsSection.getBoundingClientRect()
                  const elementTop = elementRect.top + window.scrollY
                  const targetScrollY = elementTop - offset
                  window.scrollTo({
                    top: Math.max(0, targetScrollY),
                    behavior: 'smooth'
                  })
                } else {
                  // If element not found immediately, try again after a short delay
                  setTimeout(() => {
                    const projectsSection = document.getElementById('projects')
                    if (projectsSection) {
                      const navbar = document.querySelector('header')
                      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : (window.innerWidth >= 768 ? 80 : 70)
                      const offset = navbarHeight + 16
                      const elementRect = projectsSection.getBoundingClientRect()
                      const elementTop = elementRect.top + window.scrollY
                      const targetScrollY = elementTop - offset
                      window.scrollTo({
                        top: Math.max(0, targetScrollY),
                        behavior: 'smooth'
                      })
                    }
                  }, 300)
                }
              })
            })
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover transition-all shadow-lg backdrop-blur-sm"
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
          <div ref={ref}>
            {/* Header */}
            <div className={`text-center mb-16 mt-8 md:mt-0 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
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

            {/* Projects Grid */}
            <div className="space-y-8" role="list" aria-label="Project list">
              {projects.map((project, index) => {
                const galleryItems = getGalleryItems(project)
                const total = galleryItems.length
                const currentIndex = activeMediaIndex[project.id] ?? 0
                const safeIndex = total > 0 ? Math.min(Math.max(0, currentIndex), total - 1) : 0
                const current = total > 0 ? galleryItems[safeIndex] : null
                const shouldLoadThisMedia = index === 0 || mediaShouldLoad[project.id]

                return (
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
                            {!current ? (
                              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                                  <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-60" />
                                </div>
                              </div>
                            ) : !shouldLoadThisMedia && (current.type === 'image' || current.type === 'video' || current.type === 'pdf') ? (
                              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                                  <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-60" />
                                </div>
                              </div>
                            ) : (
                              <>
                                {current.type === 'image' && (
                                  <img
                                    src={assetUrl(current.src)}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                )}

                                {current.type === 'video' && (
                                  <div className={`w-full h-full ${portraitVideos[project.id] ? 'bg-black/90 flex items-center justify-center' : ''}`}>
                                    <video
                                      className={portraitVideos[project.id] ? 'h-full w-auto max-w-full object-contain' : 'w-full h-full object-cover'}
                                      controls
                                      preload={shouldLoadThisMedia ? 'metadata' : 'none'}
                                      playsInline
                                      onLoadedMetadata={(e) => {
                                        const v = e.currentTarget
                                        const isPortrait = v.videoHeight > v.videoWidth
                                        setPortraitVideos((prev) => {
                                          if (prev[project.id] === isPortrait) return prev
                                          return { ...prev, [project.id]: isPortrait }
                                        })
                                      }}
                                    >
                                      <source src={assetUrl(current.src)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                )}

                                {current.type === 'pdf' && (
                                  <div className="w-full h-full bg-surface/70 relative">
                                    <object
                                      data={assetUrl(current.src)}
                                      type="application/pdf"
                                      className="w-full h-full"
                                      aria-label={`${project.title} PDF preview`}
                                    >
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <p className="text-sm text-muted mb-3">
                                          PDF preview isn&apos;t supported here.
                                        </p>
                                        <a
                                          href={assetUrl(current.src)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn-cta"
                                        >
                                          <FileText className="w-4 h-4" aria-hidden="true" />
                                          Open PDF
                                        </a>
                                      </div>
                                    </object>
                                  </div>
                                )}

                                {(current.type === 'csv' || current.type === 'file') && (
                                  <div className="w-full h-full bg-surface/70 flex flex-col items-center justify-center text-center p-6">
                                    {(() => {
                                      const csvKey = `${project.id}::${String(current.src)}`
                                      const status = csvPreviewStatus[csvKey]
                                      const data = csvPreviewData[csvKey]
                                      const search = csvSearch[csvKey] || ''
                                      const filteredRows = current.type === 'csv' && data?.rows
                                        ? data.rows.filter((r) =>
                                            !search
                                              ? true
                                              : r.some((cell) =>
                                                  String(cell || '').toLowerCase().includes(search.toLowerCase())
                                                )
                                          )
                                        : []

                                      return (
                                        <>
                                          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                                            <FileText className="w-7 h-7 text-primary-400" aria-hidden="true" />
                                          </div>
                                          <p className="text-sm font-semibold text-foreground mb-1">
                                            {current.type === 'csv' ? 'Data file (CSV)' : 'Document'}
                                          </p>
                                          <p className="text-xs text-muted mb-4 break-all">
                                            {String(current.src).split('/').pop()}
                                          </p>
                                          <div className="flex flex-wrap gap-2 justify-center">
                                            <a
                                              href={assetUrl(current.src)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="btn-cta"
                                            >
                                              <FileText className="w-4 h-4" aria-hidden="true" />
                                              {current.type === 'csv' ? 'Open CSV' : 'Open file'}
                                            </a>

                                            {current.type === 'csv' && (
                                              <button
                                                type="button"
                                                className="btn-cta"
                                                onClick={async (e) => {
                                                  e.stopPropagation()
                                                  if (csvPreviewStatus[csvKey] === 'loading') return
                                                  if (csvPreviewStatus[csvKey] === 'loaded') {
                                                    setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'idle' }))
                                                    return
                                                  }

                                                  setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'loading' }))
                                                  try {
                                                    const res = await fetch(assetUrl(current.src), {
                                                      headers: { Range: 'bytes=0-60000' },
                                                    })
                                                    const txt = await res.text()
                                                    const delimiter = detectDelimiter(txt)
                                                    const parsed = parseCsv(txt, delimiter, 30, 20)
                                                    setCsvPreviewData((prev) => ({
                                                      ...prev,
                                                      [csvKey]: { ...parsed, delimiter },
                                                    }))
                                                    setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'loaded' }))
                                                  } catch {
                                                    setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'error' }))
                                                  }
                                                }}
                                              >
                                                <FileText className="w-4 h-4" aria-hidden="true" />
                                                {status === 'loaded' ? 'Hide preview' : 'Preview'}
                                              </button>
                                            )}
                                          </div>

                                          {current.type === 'csv' && status === 'loading' && (
                                            <p className="mt-4 text-xs text-muted">Loading preview…</p>
                                          )}

                                          {current.type === 'csv' && status === 'error' && (
                                            <p className="mt-4 text-xs text-muted">
                                              Preview unavailable (likely CORS). Open the CSV instead.
                                            </p>
                                          )}

                                          {current.type === 'csv' && status === 'loaded' && data && (
                                            <div className="mt-4 w-full max-w-5xl">
                                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                <div className="text-[11px] text-muted">
                                                  Showing up to <span className="text-foreground font-semibold">30</span> rows
                                                  and <span className="text-foreground font-semibold">20</span> columns
                                                </div>
                                                <input
                                                  value={search}
                                                  onChange={(e) =>
                                                    setCsvSearch((prev) => ({
                                                      ...prev,
                                                      [csvKey]: e.target.value,
                                                    }))
                                                  }
                                                  placeholder="Search rows…"
                                                  className="w-full sm:w-64 rounded-lg bg-surface border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                                />
                                              </div>

                                              <div className="rounded-xl border border-border/60 overflow-hidden bg-black/20">
                                                <div className="max-h-56 overflow-auto">
                                                  <table className="min-w-full text-left text-[11px]">
                                                    {data.header.length > 0 && (
                                                      <thead className="sticky top-0 bg-surface/95 backdrop-blur border-b border-border/60">
                                                        <tr>
                                                          {data.header.map((h, idx) => (
                                                            <th
                                                              key={idx}
                                                              className="px-3 py-2 font-semibold text-foreground whitespace-nowrap"
                                                            >
                                                              {h || `col_${idx + 1}`}
                                                            </th>
                                                          ))}
                                                        </tr>
                                                      </thead>
                                                    )}
                                                    <tbody>
                                                      {(filteredRows.length ? filteredRows : data.rows).map((r, ri) => (
                                                        <tr
                                                          key={ri}
                                                          className={ri % 2 === 0 ? 'bg-transparent' : 'bg-black/20'}
                                                        >
                                                          {(data.header.length ? data.header : r).map((_, ci) => (
                                                            <td
                                                              key={ci}
                                                              className="px-3 py-2 text-muted whitespace-nowrap max-w-[220px] truncate"
                                                              title={String(r[ci] ?? '')}
                                                            >
                                                              {String(r[ci] ?? '')}
                                                            </td>
                                                          ))}
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )
                                    })()}
                                  </div>
                                )}

                                {total > 1 && (
                                  <>
                                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
                                      <button
                                        type="button"
                                        className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
                                        aria-label="Previous media"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setMediaShouldLoad((prev) =>
                                            prev[project.id] ? prev : { ...prev, [project.id]: true }
                                          )
                                          setActiveMediaIndex((prev) => {
                                            const cur = prev[project.id] ?? 0
                                            const next = (cur - 1 + total) % total
                                            return { ...prev, [project.id]: next }
                                          })
                                        }}
                                      >
                                        ‹
                                      </button>
                                      <button
                                        type="button"
                                        className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
                                        aria-label="Next media"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setMediaShouldLoad((prev) =>
                                            prev[project.id] ? prev : { ...prev, [project.id]: true }
                                          )
                                          setActiveMediaIndex((prev) => {
                                            const cur = prev[project.id] ?? 0
                                            const next = (cur + 1) % total
                                            return { ...prev, [project.id]: next }
                                          })
                                        }}
                                      >
                                        ›
                                      </button>
                                    </div>
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                      {galleryItems.map((item, i) => {
                                        const isActive = i === safeIndex
                                        return (
                                          <button
                                            key={`${item.type}-${i}`}
                                            type="button"
                                            className={`h-1.5 rounded-full transition-all ${
                                              isActive ? 'w-5 bg-white' : 'w-2 bg-white/40'
                                            }`}
                                            aria-label={`Go to ${item.type} ${i + 1}`}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setMediaShouldLoad((prev) =>
                                                prev[project.id] ? prev : { ...prev, [project.id]: true }
                                              )
                                              setActiveMediaIndex((prev) => ({
                                                ...prev,
                                                [project.id]: i,
                                              }))
                                            }}
                                          />
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>

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
                        <div className="p-4 sm:p-6 flex flex-col">
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

                          <p className="text-muted text-sm sm:text-base mb-4">
                            {project.description}
                          </p>

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

                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-10 mb-3">
                            {project.tech.map((tech) => (
                              <span key={tech} className="tech-tag text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>

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
                )
              })}
            </div>

            {/* Footer CTA */}
            <div className={`mt-12 text-center flex flex-col items-center gap-4 ${isInView ? 'animate-fade-in-up animate-delay-4' : 'opacity-0'}`}>
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

