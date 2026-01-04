// Shared geometry helpers: smooth scrolling and safe rect reads
export function smoothScrollToElement(targetElement, navbarHeight = 80, extraOffset = 16) {
  if (!targetElement) return

  // Batch layout read in rAF and perform the scroll in a subsequent rAF
  requestAnimationFrame(() => {
    try {
      const rect = targetElement.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const offset = (navbarHeight || 0) + (extraOffset || 0)
      const targetScrollY = Math.max(0, elementTop - offset)

      requestAnimationFrame(() => {
        try {
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
        } catch (e) {
          // fallback
          try { window.scrollTo(0, targetScrollY) } catch (e) {}
        }
      })
    } catch (e) {
      // ignore
    }
  })
}

// Safe rect read helper that defers to rAF and returns a Promise
export function readRect(el) {
  return new Promise((resolve) => {
    if (!el) return resolve(null)
    requestAnimationFrame(() => {
      try {
        const r = el.getBoundingClientRect()
        resolve(r)
      } catch (e) {
        resolve(null)
      }
    })
  })
}
