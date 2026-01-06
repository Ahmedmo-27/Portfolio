// Shared geometry helpers: smooth scrolling and safe rect reads
// Geometry scheduling: batch reads then writes in a single animation frame
const readQueue = []
const writeQueue = []
let frameScheduled = null

function scheduleFrame() {
  if (frameScheduled != null) return
  frameScheduled = typeof window !== 'undefined' ? requestAnimationFrame(() => {
    frameScheduled = null

    // Perform all reads first (safe to read layout)
    try {
        // Snapshot scroll position once per frame and copy rect values to plain objects
        const pageY = typeof window !== 'undefined' ? window.scrollY : 0
        for (const item of readQueue.splice(0)) {
          try {
            const r = item.el.getBoundingClientRect()
            // Return a plain object with rect fields + page scroll to avoid later reads
            const copy = {
              left: r.left,
              top: r.top,
              right: r.right,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
              x: r.x,
              y: r.y,
              scrollY: pageY
            }
            item.resolve(copy)
          } catch (e) {
            item.resolve(null)
          }
        }
    } catch (e) {
      // ensure all promises are resolved even on error
        for (const item of readQueue.splice(0)) item.resolve(null)
    }

    // Then run writes (mutations)
    try {
      for (const fn of writeQueue.splice(0)) {
        try { fn() } catch (e) {}
      }
    } catch (e) {
      // swallow
    }
  }) : null
}

// Safe rect read helper that defers to a batched rAF and returns a Promise
export function readRect(el) {
  return new Promise((resolve) => {
    if (!el) return resolve(null)
    readQueue.push({ el, resolve })
    scheduleFrame()
  })
}

// Schedule a write (DOM mutation) to run in the write phase of the
// batched rAF scheduler. Use this instead of calling rAF directly when
// the write should occur after batched reads to avoid forced reflows.
export function scheduleWrite(fn) {
  if (typeof fn !== 'function') return
  writeQueue.push(fn)
  scheduleFrame()
}

// Smooth scroll that uses the batched read/write scheduler. This avoids nested rAFs
// and ensures layout reads happen before the scroll write.
export function smoothScrollToElement(targetElement, navbarHeight = 80, extraOffset = 16) {
  if (!targetElement) return

  readRect(targetElement).then((rect) => {
    if (!rect) return
    // rect includes a snapshot of page scroll to avoid extra layout reads
    const elementTop = rect.top + (rect.scrollY || 0)
    const offset = (navbarHeight || 0) + (extraOffset || 0)
    const targetScrollY = Math.max(0, elementTop - offset)

    // Schedule the actual scrolling as a write in the next frame
    writeQueue.push(() => {
      try {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
      } catch (e) {
        try { window.scrollTo(0, targetScrollY) } catch (e) {}
      }
    })
    scheduleFrame()
  }).catch(() => {})
}
