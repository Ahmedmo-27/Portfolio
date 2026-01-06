// Lightweight helper to batch multiple element.style.setProperty calls in a single rAF
const pending = new Map();
let rafId = null;

function flush() {
  rafId = null;
  for (const [el, props] of pending.entries()) {
    try {
      for (const key in props) {
        el.style.setProperty(key, props[key]);
      }
    } catch (e) {
      // ignore if element was removed
    }
  }
  pending.clear();
}

function scheduleFlush() {
  // Ensure we run the actual DOM writes after the current rAF frame's reads.
  // Prefer requestIdleCallback when available (non-blocking), otherwise
  // defer with setTimeout to the next macrotask so any rAF-based reads run first.
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(flush, { timeout: 100 });
  } else {
    setTimeout(flush, 0);
  }
}

export default function batchSetProperty(el, prop, value) {
  if (!el) return;
  let props = pending.get(el);
  if (!props) {
    props = Object.create(null);
    pending.set(el, props);
  }
  props[prop] = value;
  if (!rafId) {
    // Schedule a rAF to coalesce multiple synchronous calls, then defer the
    // actual style writes until after rAF via scheduleFlush.
    rafId = requestAnimationFrame(() => {
      rafId = null;
      scheduleFlush();
    });
  }
}
