import { useState, useEffect, useRef, Suspense } from 'react'
import SkeletonLoader from './SkeletonLoader'

// LazySection component that only renders its children when they are near the viewport
// This significantly reduces initial bundle size and TBT (Total Blocking Time)
export default function LazySection({ children, fallback, threshold = 0.1, rootMargin = '200px', id }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    // If already visible, no need to observe
    if (isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use startTransition or requestAnimationFrame to avoid blocking main thread during scroll
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => setIsVisible(true))
          } else {
            requestAnimationFrame(() => setIsVisible(true))
          }
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin // Load content before it comes into view
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [isVisible, threshold, rootMargin])

  // Default fallback if none provided
  const loadingFallback = fallback || (
    <div className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonLoader variant="section" />
      </div>
    </div>
  )

  return (
    <div ref={ref} id={id} className="min-h-[100px]">
      {isVisible ? (
        <Suspense fallback={loadingFallback}>
          {children}
        </Suspense>
      ) : (
        loadingFallback
      )}
    </div>
  )
}
