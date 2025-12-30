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

export default function batchSetProperty(el, prop, value) {
  if (!el) return;
  let props = pending.get(el);
  if (!props) {
    props = Object.create(null);
    pending.set(el, props);
  }
  props[prop] = value;
  if (!rafId) {
    rafId = requestAnimationFrame(flush);
  }
}
