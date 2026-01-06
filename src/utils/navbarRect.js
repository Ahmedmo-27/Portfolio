let navbar = null
let currentHeight = 80
let ro = null

import { readRect } from './geometry'

function ensureObserver() {
  if (navbar && ro) return
  navbar = document.querySelector('header')
  if (!navbar) return
  try {
    // Use shared read helper to obtain the initial height without
    // forcing a synchronous getBoundingClientRect call here.
    readRect(navbar).then((r) => {
      if (r && r.height) currentHeight = r.height || currentHeight
    }).catch(() => {})

    // Use ResizeObserver's contentRect when available to avoid extra layout reads
    ro = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return
      const entry = entries[0]
      if (entry.contentRect && entry.contentRect.height) {
        currentHeight = entry.contentRect.height
        return
      }
      // Fallback: use readRect to defer the expensive read
      readRect(navbar).then((r) => {
        if (r && r.height) currentHeight = r.height || currentHeight
      }).catch(() => {})
    })
    ro.observe(navbar)
  } catch (e) {
    // ResizeObserver may not be available in some environments — use readRect
    readRect(navbar).then((r) => {
      if (r && r.height) currentHeight = r.height || currentHeight
    }).catch(() => {})
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
