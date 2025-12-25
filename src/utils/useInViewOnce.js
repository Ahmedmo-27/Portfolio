import { useEffect, useRef, useState } from 'react'

/**
 * Observe an element and track `isInView` state continuously.
 * `isInView` is true when the element is in the viewport, false when it's not.
 * Useful for animations that should trigger when entering and reverse when leaving.
 */
export function useInViewOnce(options = {}) {
  const { threshold = 0.1, rootMargin = '-100px', initialInView = false } = options

  const ref = useRef(null)
  const [isInView, setIsInView] = useState(initialInView)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If the browser doesn't support IntersectionObserver, just render immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return { ref, isInView }
}


