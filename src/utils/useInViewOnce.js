import { useEffect, useRef, useState } from 'react'

/**
 * Observe an element and flip `isInView` to true the first time it enters the viewport.
 * Useful for one-time entrance animations.
 */
export function useInViewOnce(options = {}) {
  const { threshold = 0.1, rootMargin = '-100px', initialInView = false } = options

  const ref = useRef(null)
  const [isInView, setIsInView] = useState(initialInView)

  useEffect(() => {
    if (isInView) return

    const el = ref.current
    if (!el) return

    // If the browser doesn't support IntersectionObserver, just render immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isInView, rootMargin, threshold])

  return { ref, isInView }
}


