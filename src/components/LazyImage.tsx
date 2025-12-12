import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto'
  priority?: boolean
}

/**
 * LazyImage component with built-in lazy loading, blur placeholder, and animation
 * Usage: <LazyImage src="/path/to/image.jpg" alt="Description" />
 * 
 * TODO: Replace placeholder with your actual placeholder image or generate blur hash
 */
export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder,
  aspectRatio = 'auto',
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: '',
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-surface ${aspectRatioClasses[aspectRatio]} ${className}`}
    >
      {/* Placeholder / Loading state */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-surface animate-pulse"
          aria-hidden="true"
        >
          {placeholder && (
            <img 
              src={placeholder} 
              alt="" 
              className="w-full h-full object-cover blur-lg scale-105"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface text-muted">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !error && (
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}

/**
 * ProjectImage - Specialized component for project screenshots/videos
 * Includes placeholder text for where to add media
 */
interface ProjectImageProps {
  projectName: string
  className?: string
  src?: string
  alt?: string
}

export function ProjectImage({ projectName, className = '', src, alt }: ProjectImageProps) {
  if (src) {
    return (
      <LazyImage 
        src={src} 
        alt={alt || `${projectName} screenshot`}
        className={className}
        aspectRatio="video"
      />
    )
  }

  return (
    <div 
      className={`aspect-video rounded-xl bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center p-6 text-center ${className}`}
      role="img"
      aria-label={`Placeholder for ${projectName} media`}
    >
      <div className="w-16 h-16 mb-4 rounded-2xl bg-surface-hover flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-muted" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
      <p className="text-muted text-sm font-medium mb-1">
        {projectName} Screenshot
      </p>
      <p className="text-muted/60 text-xs">
        TODO: Add project screenshots or video
      </p>
    </div>
  )
}

