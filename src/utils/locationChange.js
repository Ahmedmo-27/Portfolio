// Patch history methods to emit a `locationchange` event when URL changes via pushState/replaceState
(function () {
  if (typeof window === 'undefined' || !window.history) return

  const wrap = (method) => {
    const orig = window.history[method]
    return function (...args) {
      const result = orig.apply(this, args)
      try {
        window.dispatchEvent(new Event('locationchange'))
      } catch (e) {
        // ignore
      }
      return result
    }
  }

  window.history.pushState = wrap('pushState')
  window.history.replaceState = wrap('replaceState')

  window.addEventListener('popstate', () => {
    try {
      window.dispatchEvent(new Event('locationchange'))
    } catch (e) {}
  })
})()
