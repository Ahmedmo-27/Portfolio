import { useRef, useState, useEffect } from 'react'
import { Github, ChevronRight, FileText } from 'lucide-react'
import CircuitBoard from './CircuitBoard'
import ViewMoreButton from './ViewMoreButton'
import { projects } from '../data/projects'
import { assetUrl } from '../utils/assetUrl'
import { useInViewOnce } from '../utils/useInViewOnce'
import './Projects.css'

// Keep only first 2 projects for the home page
const initialDisplayCount = 2
const displayedProjects = projects.slice(0, initialDisplayCount)

export default function Projects() {
  const { ref, isInView } = useInViewOnce()
  const [activeProject, setActiveProject] = useState(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState({})
  const [portraitVideos, setPortraitVideos] = useState({})
  const [portraitImages, setPortraitImages] = useState({}) // key -> boolean (projectId::itemIndex)
  const [mediaShouldLoad, setMediaShouldLoad] = useState({}) // projectId -> boolean
  const [mediaLoading, setMediaLoading] = useState({}) // projectId -> boolean
  const [mediaLoaded, setMediaLoaded] = useState({}) // projectId -> Set of loaded indices
  const [pdfPreviewFailed, setPdfPreviewFailed] = useState({}) // key -> boolean (projectId::itemIndex)
  const [csvPreviewData, setCsvPreviewData] = useState({}) // key -> { header: string[], rows: string[][], delimiter: string }
  const [csvPreviewStatus, setCsvPreviewStatus] = useState({}) // idle | loading | loaded | error
  const [csvSearch, setCsvSearch] = useState({}) // key -> search string

  const projectItemElsRef = useRef({}) // projectId -> HTMLElement
  const mediaObserverRef = useRef(null)

  // Lazy load heavy media (images/videos/pdf embeds) when the project card approaches viewport
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

  // Lightweight CSV parser (handles quoted fields, escaped quotes)
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
      // Trim trailing empty columns
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
          // ignore \r (handled by \n)
        } else {
          field += c
        }
      }
    }

    if (rows.length < maxRows) {
      pushField()
      // Only push if we have any content
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

    // PDF / slides / docs
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
                        {(() => {
                          const galleryItems = getGalleryItems(project)
                          const total = galleryItems.length
                          const currentIndex = activeMediaIndex[project.id] ?? 0
                          const safeIndex = total > 0 ? Math.min(Math.max(0, currentIndex), total - 1) : 0
                          const shouldLoadThisMedia = index === 0 || mediaShouldLoad[project.id]
                          const isLoading = mediaLoading[project.id] || false
                          const loadedIndices = mediaLoaded[project.id] || new Set()

                          if (total === 0) {
                            return (
                              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                                  <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-60" />
                                </div>
                              </div>
                            )
                          }

                          return (
                            <div className="media-carousel-container">
                              {/* Loading Overlay */}
                              <div className={`media-loading-overlay ${isLoading ? 'show' : ''}`}>
                                <div className="media-loading-spinner" aria-label="Loading media" />
                              </div>

                              {/* Carousel Track */}
                              <div 
                                className="media-carousel-track"
                                style={{ transform: `translateX(-${safeIndex * 100}%)` }}
                              >
                                {galleryItems.map((item, itemIndex) => {
                                  const isActive = itemIndex === safeIndex
                                  const shouldLoad = shouldLoadThisMedia || loadedIndices.has(itemIndex)
                                  const isItemLoading = isLoading && isActive && !loadedIndices.has(itemIndex)

                                  // Lazy-load heavy media types
                                  if (!shouldLoad && (item.type === 'image' || item.type === 'video' || item.type === 'pdf')) {
                                    return (
                                      <div 
                                        key={`${item.type}-${itemIndex}`}
                                        className={`media-carousel-item ${isActive ? 'active' : ''} ${isItemLoading ? 'loading' : ''}`}
                                      >
                                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                          <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                                            <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-60" />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }

                                  return (
                                    <div 
                                      key={`${item.type}-${itemIndex}`}
                                      className={`media-carousel-item ${isActive ? 'active' : ''} ${isItemLoading ? 'loading' : ''}`}
                                    >
                                      {item.type === 'image' && (() => {
                                        const imageKey = `${project.id}::${itemIndex}`
                                        const isPortrait = portraitImages[imageKey]
                                        return (
                                          <div
                                            className={`w-full h-full ${
                                              isPortrait
                                                ? 'bg-black/90 flex items-center justify-center'
                                                : ''
                                            }`}
                                          >
                                            <img
                                              src={assetUrl(item.src)}
                                              alt={`${project.title} - ${itemIndex + 1}`}
                                              className={
                                                isPortrait
                                                  ? 'h-full w-auto max-w-full object-contain'
                                                  : 'w-full h-full object-cover'
                                              }
                                              loading="lazy"
                                              decoding="async"
                                              onLoad={(e) => {
                                                const img = e.currentTarget
                                                const isImgPortrait = img.naturalHeight > img.naturalWidth
                                                setPortraitImages((prev) => {
                                                  if (prev[imageKey] === isImgPortrait) return prev
                                                  return { ...prev, [imageKey]: isImgPortrait }
                                                })
                                                setMediaLoaded((prev) => {
                                                  const newSet = new Set(prev[project.id] || [])
                                                  newSet.add(itemIndex)
                                                  return { ...prev, [project.id]: newSet }
                                                })
                                                setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                              }}
                                              onError={() => {
                                                setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                              }}
                                            />
                                          </div>
                                        )
                                      })()}

                                      {item.type === 'video' && (
                                        <div
                                          className={`w-full h-full ${
                                            portraitVideos[project.id]
                                              ? 'bg-black/90 flex items-center justify-center'
                                              : ''
                                          }`}
                                        >
                                          <video
                                            className={
                                              portraitVideos[project.id]
                                                ? 'h-full w-auto max-w-full object-contain'
                                                : 'w-full h-full object-cover'
                                            }
                                            controls
                                            preload={shouldLoad ? 'metadata' : 'none'}
                                            playsInline
                                            onLoadedMetadata={(e) => {
                                              const v = e.currentTarget
                                              const isPortrait = v.videoHeight > v.videoWidth
                                              setPortraitVideos((prev) => {
                                                if (prev[project.id] === isPortrait) return prev
                                                return { ...prev, [project.id]: isPortrait }
                                              })
                                              setMediaLoaded((prev) => {
                                                const newSet = new Set(prev[project.id] || [])
                                                newSet.add(itemIndex)
                                                return { ...prev, [project.id]: newSet }
                                              })
                                              setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                            }}
                                            onCanPlay={() => {
                                              setMediaLoaded((prev) => {
                                                const newSet = new Set(prev[project.id] || [])
                                                newSet.add(itemIndex)
                                                return { ...prev, [project.id]: newSet }
                                              })
                                              setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                            }}
                                            onError={() => {
                                              setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                            }}
                                          >
                                            <source src={assetUrl(item.src)} type="video/mp4" />
                                            Your browser does not support the video tag.
                                          </video>
                                        </div>
                                      )}

                                      {item.type === 'pdf' && (() => {
                                        const pdfKey = `${project.id}::${itemIndex}`
                                        const hasFailed = pdfPreviewFailed[pdfKey]
                                        
                                        return (
                                          <div className="w-full h-full bg-surface/70 relative">
                                            <iframe
                                              src={hasFailed ? undefined : `${assetUrl(item.src)}#toolbar=1&navpanes=1&scrollbar=1`}
                                              className={`w-full h-full border-0 ${hasFailed ? 'hidden' : ''}`}
                                              title={`${project.title} PDF preview`}
                                              onLoad={(e) => {
                                                setMediaLoaded((prev) => {
                                                  const newSet = new Set(prev[project.id] || [])
                                                  newSet.add(itemIndex)
                                                  return { ...prev, [project.id]: newSet }
                                                })
                                                setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                                
                                                // Check after a delay if PDF actually loaded
                                                // Cross-origin restrictions prevent direct access, so we use a timeout
                                                setTimeout(() => {
                                                  try {
                                                    const iframe = e.currentTarget
                                                    // Try to access iframe - will throw if cross-origin
                                                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                                                    // If we can't access, it might be cross-origin (which is fine) or failed
                                                    // We'll let the browser handle it and show fallback only on explicit error
                                                  } catch (err) {
                                                    // Cross-origin is expected and fine - PDF should still display
                                                    // Only show fallback if we get an explicit error event
                                                  }
                                                }, 500)
                                              }}
                                              onError={() => {
                                                setPdfPreviewFailed((prev) => ({ ...prev, [pdfKey]: true }))
                                                setMediaLoading((prev) => ({ ...prev, [project.id]: false }))
                                              }}
                                            />
                                            {/* Fallback shown when PDF preview fails */}
                                            {hasFailed && (
                                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-surface/95 backdrop-blur-sm">
                                                <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                                                  <FileText className="w-8 h-8 text-primary-400" aria-hidden="true" />
                                                </div>
                                                <p className="text-sm font-semibold text-foreground mb-2">
                                                  PDF Preview Unavailable
                                                </p>
                                                <p className="text-xs text-muted mb-4">
                                                  Your browser doesn&apos;t support PDF preview. Click below to open the PDF file.
                                                </p>
                                                <a
                                                  href={assetUrl(item.src)}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="btn-cta"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <FileText className="w-4 h-4" aria-hidden="true" />
                                                  Open PDF
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })()}

                                      {(item.type === 'csv' || item.type === 'file') && (
                                        <div className="w-full h-full bg-surface/70 flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-6 overflow-y-auto">
                                          {(() => {
                                            const csvKey = `${project.id}::${String(item.src)}`
                                            const status = csvPreviewStatus[csvKey]
                                            const data = csvPreviewData[csvKey]
                                            const search = csvSearch[csvKey] || ''
                                            const filteredRows =
                                              item.type === 'csv' && data?.rows
                                                ? data.rows.filter((r) =>
                                                    !search
                                                      ? true
                                                      : r.some((cell) =>
                                                          String(cell || '')
                                                            .toLowerCase()
                                                            .includes(search.toLowerCase())
                                                      )
                                                  )
                                                : []

                                            return (
                                              <>
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-surface border border-border flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0">
                                                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary-400" aria-hidden="true" />
                                                </div>
                                                <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">
                                                  {item.type === 'csv' ? 'Data file (CSV)' : 'Document'}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-muted mb-3 sm:mb-4 break-all px-2">
                                                  {String(item.src).split('/').pop()}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center w-full px-2">
                                                  <a
                                                    href={assetUrl(item.src)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-cta text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                                  >
                                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                                                    {item.type === 'csv' ? 'Open CSV' : 'Open file'}
                                                  </a>

                                                  {item.type === 'csv' && (
                                                    <button
                                                      type="button"
                                                      className="btn-cta text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                                      onClick={async (e) => {
                                                        e.stopPropagation()
                                                        if (csvPreviewStatus[csvKey] === 'loading') return
                                                        if (csvPreviewStatus[csvKey] === 'loaded') {
                                                          setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'idle' }))
                                                          return
                                                        }

                                                        setCsvPreviewStatus((prev) => ({ ...prev, [csvKey]: 'loading' }))
                                                        try {
                                                          const res = await fetch(assetUrl(item.src), {
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
                                                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                                                      {status === 'loaded' ? 'Hide preview' : 'Preview'}
                                                    </button>
                                                  )}
                                                </div>

                                                {item.type === 'csv' && status === 'loading' && (
                                                  <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted">Loading preview…</p>
                                                )}

                                                {item.type === 'csv' && status === 'error' && (
                                                  <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-muted px-2">
                                                    Preview unavailable (likely CORS). Open the CSV instead.
                                                  </p>
                                                )}

                                                {item.type === 'csv' && status === 'loaded' && data && (
                                                  <div className="mt-3 sm:mt-4 w-full max-w-5xl -mx-1 sm:-mx-2 md:mx-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 sm:mb-3 px-1 sm:px-2 md:px-0">
                                                      <div className="text-[9px] sm:text-[10px] md:text-[11px] text-muted">
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
                                                        className="w-full sm:w-64 rounded-lg bg-surface border border-border px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                                      />
                                                    </div>

                                                    <div className="rounded-lg sm:rounded-xl border border-border/60 overflow-hidden bg-black/20">
                                                      <div className="csv-preview-container max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto overflow-x-auto overscroll-x-contain -webkit-overflow-scrolling-touch">
                                                        <div className="inline-block min-w-full align-middle">
                                                          <table className="min-w-full text-left text-[9px] sm:text-[10px] md:text-[11px]">
                                                            {data.header.length > 0 && (
                                                              <thead className="sticky top-0 bg-surface/95 backdrop-blur border-b border-border/60 z-10">
                                                                <tr>
                                                                  {data.header.map((h, idx) => (
                                                                    <th
                                                                      key={idx}
                                                                      className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 font-semibold text-foreground whitespace-nowrap text-[9px] sm:text-[10px] md:text-[11px]"
                                                                    >
                                                                      <span className="block truncate max-w-[80px] sm:max-w-[120px] md:max-w-none" title={h || `col_${idx + 1}`}>
                                                                        {h || `col_${idx + 1}`}
                                                                      </span>
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
                                                                      className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-muted whitespace-nowrap max-w-[80px] sm:max-w-[120px] md:max-w-[220px] truncate"
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
                                                    <div className="mt-1.5 sm:mt-2 px-1 sm:px-2 md:px-0">
                                                      <p className="text-[9px] sm:text-[10px] md:text-[11px] text-muted">
                                                        💡 Swipe horizontally to view all columns
                                                      </p>
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )
                                          })()}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Navigation Buttons */}
                              {total > 1 && (
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
                                  <button
                                    type="button"
                                    className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
                                    aria-label="Previous media"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const cur = activeMediaIndex[project.id] ?? 0
                                      const next = (cur - 1 + total) % total
                                      const isAlreadyLoaded = (mediaLoaded[project.id] || new Set()).has(next)
                                      
                                      setMediaShouldLoad((prev) =>
                                        prev[project.id] ? prev : { ...prev, [project.id]: true }
                                      )
                                      
                                      if (!isAlreadyLoaded) {
                                        setMediaLoading((prev) => ({ ...prev, [project.id]: true }))
                                      }
                                      
                                      setActiveMediaIndex((prev) => ({
                                        ...prev,
                                        [project.id]: next,
                                      }))
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
                                      const cur = activeMediaIndex[project.id] ?? 0
                                      const next = (cur + 1) % total
                                      const isAlreadyLoaded = (mediaLoaded[project.id] || new Set()).has(next)
                                      
                                      setMediaShouldLoad((prev) =>
                                        prev[project.id] ? prev : { ...prev, [project.id]: true }
                                      )
                                      
                                      if (!isAlreadyLoaded) {
                                        setMediaLoading((prev) => ({ ...prev, [project.id]: true }))
                                      }
                                      
                                      setActiveMediaIndex((prev) => ({
                                        ...prev,
                                        [project.id]: next,
                                      }))
                                    }}
                                  >
                                    ›
                                  </button>
                                </div>
                              )}

                              {/* Dots Indicator */}
                              {total > 1 && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {galleryItems.map((item, i) => {
                                    const isActive = i === safeIndex
                                    const label =
                                      item.type === 'video'
                                        ? 'Go to video'
                                        : item.type === 'pdf'
                                          ? 'Go to document'
                                          : item.type === 'csv'
                                            ? 'Go to data file'
                                            : item.type === 'file'
                                              ? 'Go to file'
                                            : `Go to screenshot ${i + 1}`
                                    return (
                                      <button
                                        key={`${item.type}-${i}`}
                                        type="button"
                                        className={`h-1.5 rounded-full transition-all ${
                                          isActive ? 'w-5 bg-white' : 'w-2 bg-white/40'
                                        }`}
                                        aria-label={label}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const isAlreadyLoaded = (mediaLoaded[project.id] || new Set()).has(i)
                                          
                                          setMediaShouldLoad((prev) =>
                                            prev[project.id] ? prev : { ...prev, [project.id]: true }
                                          )
                                          
                                          if (!isAlreadyLoaded) {
                                            setMediaLoading((prev) => ({ ...prev, [project.id]: true }))
                                          }
                                          
                                          setActiveMediaIndex((prev) => ({
                                            ...prev,
                                            [project.id]: i,
                                          }))
                                        }}
                                      />
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })()}
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

