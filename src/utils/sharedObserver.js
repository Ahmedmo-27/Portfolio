// Shared IntersectionObserver utility
// Creates or reuses an IntersectionObserver per unique options key
const observers = new Map()

const getKey = (threshold, rootMargin) => `${Array.isArray(threshold) ? threshold.join(',') : threshold}|${rootMargin}`

function createObserver(threshold, rootMargin) {
  const callbacks = new WeakMap()

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const cb = callbacks.get(entry.target)
      if (!cb) return

      // invoke callback asynchronously to avoid blocking the observer loop
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => cb(entry))
      } else {
        requestAnimationFrame(() => cb(entry))
      }
    })
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
