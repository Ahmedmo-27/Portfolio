let navbar = null
let currentHeight = 80
let ro = null

function ensureObserver() {
  if (navbar && ro) return
  navbar = document.querySelector('header')
  if (!navbar) return
  try {
    // Defer the initial layout read to rAF to avoid forcing synchronous reflow
    requestAnimationFrame(() => {
      try {
        currentHeight = navbar.getBoundingClientRect().height || currentHeight
      } catch (e) {}
    })

    // Use ResizeObserver's contentRect when available to avoid extra layout reads
    ro = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return
      const entry = entries[0]
      if (entry.contentRect && entry.contentRect.height) {
        currentHeight = entry.contentRect.height
        return
      }
      // Fallback: defer expensive read to rAF
      requestAnimationFrame(() => {
        try {
          currentHeight = navbar.getBoundingClientRect().height || currentHeight
        } catch (e) {}
      })
    })
    ro.observe(navbar)
  } catch (e) {
    // ResizeObserver may not be available in some environments — defer read
    requestAnimationFrame(() => {
      try { currentHeight = navbar.offsetHeight || currentHeight } catch (e) {}
    })
  }
}

export function getNavbarHeight() {
  if (typeof window === 'undefined') return currentHeight
  ensureObserver()
  return currentHeight
}

export function disconnect() {
  if (ro && navbar) {
    try { ro.disconnect() } catch (e) {}
  }
  ro = null
}
