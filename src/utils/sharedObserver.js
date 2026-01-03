// Shared IntersectionObserver utility
// Creates or reuses an IntersectionObserver per unique options key
const observers = new Map()

const getKey = (threshold, rootMargin) => `${Array.isArray(threshold) ? threshold.join(',') : threshold}|${rootMargin}`

function createObserver(threshold, rootMargin) {
  const callbacks = new WeakMap()

  // Pending entries per observed target. We store the latest entry for each
  // target and process them in a single scheduled task (rAF or rIC).
  const pending = new Map()
  let scheduled = null

  const flush = () => {
    scheduled = null
    if (pending.size === 0) return

    // Snapshot keys to avoid mutation issues while processing
    const entries = Array.from(pending.values())
    pending.clear()

    for (const entry of entries) {
      const cb = callbacks.get(entry.target)
      if (!cb) continue
      try { cb(entry) } catch (e) { /* ignore callback errors */ }
    }
  }

  const scheduleFlush = () => {
    if (scheduled != null) return
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    )
    const useIdle = typeof window !== 'undefined' && 'requestIdleCallback' in window && !isTouch
    if (useIdle) {
      scheduled = requestIdleCallback(() => flush())
    } else {
      scheduled = requestAnimationFrame(() => flush())
    }
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      // keep the latest entry for this target
      pending.set(entry.target, entry)
    }
    scheduleFlush()
  }, { threshold, rootMargin })

  return { observer, callbacks }
}

/**
 * Observe an element.
 * Options:
 *  - threshold, rootMargin: forwarded to IntersectionObserver
 *  - once: boolean (default true) - if true, the element will be unobserved after it intersects
 */
export function observe(element, cb, { threshold = 0.1, rootMargin = '200px', once = true } = {}) {
  if (!element) return () => {}
  const key = getKey(threshold, rootMargin)
  let entry = observers.get(key)
  if (!entry) {
    entry = createObserver(threshold, rootMargin)
    observers.set(key, entry)
  }

  const wrapped = (entryObj) => {
    cb(entryObj)
    if (once && entryObj.isIntersecting) {
      try { entry.observer.unobserve(entryObj.target) } catch (e) {}
      entry.callbacks.delete(entryObj.target)
    }
  }

  entry.callbacks.set(element, wrapped)
  entry.observer.observe(element)

  return () => {
    try {
      entry.observer.unobserve(element)
    } catch (e) {
      // ignore
    }
    entry.callbacks.delete(element)
  }
}

export function disconnectAll() {
  observers.forEach(({ observer }) => observer.disconnect())
  observers.clear()
}
