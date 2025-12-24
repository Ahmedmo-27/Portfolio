import { useState, useCallback, memo, useRef, startTransition, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { assetUrl } from '../utils/assetUrl'

// File extension helper
const fileExt = (src) => {
  if (!src || typeof src !== 'string') return ''
  const withoutQuery = src.split('?')[0]
  const lastDot = withoutQuery.lastIndexOf('.')
  if (lastDot === -1) return ''
  return withoutQuery.slice(lastDot + 1).toLowerCase()
}

// Get gallery items from project
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

// Simple memoized nav button
const NavButton = memo(function NavButton({ direction, onClick }) {
  return (
    <button
      type="button"
      className="pointer-events-auto inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs sm:text-sm transition-colors"
      aria-label={direction === 'prev' ? 'Previous media' : 'Next media'}
      onClick={onClick}
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  )
})

// Simple memoized dot button - use specific transitions instead of transition-all
const DotButton = memo(function DotButton({ isActive, index, onClick }) {
  return (
    <button
      type="button"
      className={`h-1.5 rounded-full transition-[width,background-color] duration-150 ${isActive ? 'w-5 bg-white' : 'w-2 bg-white/40'}`}
      aria-label={`Go to slide ${index + 1}`}
      onClick={onClick}
    />
  )
})

// Media carousel component - manages its own state for better INP
function MediaCarousel({ project, shouldLoad = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedIndices, setLoadedIndices] = useState(new Set([0]))
  const [portraitImages, setPortraitImages] = useState({})
  const [portraitVideo, setPortraitVideo] = useState(false)
  
  // Use ref to track loaded indices without causing re-renders during navigation
  const loadedIndicesRef = useRef(loadedIndices)
  loadedIndicesRef.current = loadedIndices

  const galleryItems = getGalleryItems(project)
  const total = galleryItems.length
  const safeIndex = total > 0 ? Math.min(Math.max(0, currentIndex), total - 1) : 0

  // Preload first 3 images when shouldLoad becomes true
  useEffect(() => {
    if (!shouldLoad || total === 0) return
    
    // Preload first 3 images in background
    const imagesToPreload = galleryItems
      .slice(0, 3)
      .filter(item => item.type === 'image')
      .map(item => assetUrl(item.src))
    
    imagesToPreload.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [shouldLoad, total, galleryItems])

  const goTo = useCallback((index) => {
    // Immediate index update for responsive UI
    setCurrentIndex(index)
    
    // Defer the loaded indices update to not block main thread
    // Also preload adjacent slides for smoother navigation
    startTransition(() => {
      setLoadedIndices(prev => {
        const next = new Set(prev)
        next.add(index)
        // Preload prev and next slides
        if (total > 1) {
          next.add((index + 1) % total)
          next.add((index - 1 + total) % total)
        }
        return next
      })
    })
  }, [total])

  const goPrev = useCallback((e) => {
    e.stopPropagation()
    goTo((currentIndex - 1 + total) % total)
  }, [currentIndex, total, goTo])

  const goNext = useCallback((e) => {
    e.stopPropagation()
    goTo((currentIndex + 1) % total)
  }, [currentIndex, total, goTo])

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
      {/* Carousel Track */}
      <div 
        className="media-carousel-track"
        style={{ transform: `translateX(-${safeIndex * 100}%)` }}
      >
        {galleryItems.map((item, itemIndex) => {
          const isActive = itemIndex === safeIndex
          const itemShouldLoad = shouldLoad || loadedIndices.has(itemIndex)

          // Placeholder for unloaded items
          if (!itemShouldLoad && (item.type === 'image' || item.type === 'video' || item.type === 'pdf')) {
            return (
              <div 
                key={`${item.type}-${itemIndex}`}
                className={`media-carousel-item ${isActive ? 'active' : ''}`}
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
              className={`media-carousel-item ${isActive ? 'active' : ''}`}
            >
              {item.type === 'image' && (
                <div className={`w-full h-full ${portraitImages[itemIndex] ? 'bg-black/90 flex items-center justify-center' : ''}`}>
                  <img
                    src={assetUrl(item.src)}
                    alt={`${project.title} - ${itemIndex + 1}`}
                    className={portraitImages[itemIndex] ? 'h-full w-auto max-w-full object-contain' : 'w-full h-full object-cover'}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                    width={1920}
                    height={1080}
                    onLoad={(e) => {
                      const img = e.currentTarget
                      // Update width/height with actual dimensions once loaded
                      if (img.naturalWidth && img.naturalHeight) {
                        img.width = img.naturalWidth
                        img.height = img.naturalHeight
                      }
                      const isPortrait = img.naturalHeight > img.naturalWidth
                      if (isPortrait) {
                        // Defer portrait detection to not block interaction
                        startTransition(() => {
                          setPortraitImages(prev => ({ ...prev, [itemIndex]: true }))
                        })
                      }
                    }}
                  />
                </div>
              )}

              {item.type === 'video' && (
                <div className={`w-full h-full ${portraitVideo ? 'bg-black/90 flex items-center justify-center' : ''}`}>
                  <video
                    className={portraitVideo ? 'h-full w-auto max-w-full object-contain' : 'w-full h-full object-cover'}
                    controls
                    preload="metadata"
                    playsInline
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget
                      if (v.videoHeight > v.videoWidth) {
                        // Defer portrait detection to not block interaction
                        startTransition(() => {
                          setPortraitVideo(true)
                        })
                      }
                    }}
                  >
                    <source src={assetUrl(item.src)} type="video/mp4" />
                  </video>
                </div>
              )}

              {item.type === 'pdf' && (
                <div className="w-full h-full bg-surface/70 relative">
                  <iframe
                    src={`${assetUrl(item.src)}#toolbar=1&navpanes=1`}
                    className="w-full h-full border-0"
                    title={`${project.title} PDF`}
                  />
                </div>
              )}

              {(item.type === 'csv' || item.type === 'file') && (
                <div className="w-full h-full bg-surface/70 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-primary-400" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {item.type === 'csv' ? 'Data file (CSV)' : 'Document'}
                  </p>
                  <p className="text-xs text-muted mb-3 break-all px-2">
                    {String(item.src).split('/').pop()}
                  </p>
                  <a
                    href={assetUrl(item.src)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta text-xs px-3 py-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Open {item.type === 'csv' ? 'CSV' : 'file'}
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      {total > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
          <NavButton direction="prev" onClick={goPrev} />
          <NavButton direction="next" onClick={goNext} />
        </div>
      )}

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {galleryItems.map((_, i) => (
            <DotButton
              key={i}
              isActive={i === safeIndex}
              index={i}
              onClick={(e) => {
                e.stopPropagation()
                goTo(i)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(MediaCarousel)

