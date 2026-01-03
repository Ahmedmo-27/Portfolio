let navbar = null
let currentHeight = 80
let ro = null

function ensureObserver() {
  if (navbar && ro) return
  navbar = document.querySelector('header')
  if (!navbar) return
  try {
    // Capture initial height and keep it updated via ResizeObserver
    currentHeight = navbar.getBoundingClientRect().height || currentHeight
    ro = new ResizeObserver(() => {
      try {
        currentHeight = navbar.getBoundingClientRect().height || currentHeight
      } catch (e) {}
    })
    ro.observe(navbar)
  } catch (e) {
    // ResizeObserver may not be available in some environments
    currentHeight = navbar.offsetHeight || currentHeight
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
