// Lightweight page-level section observer.
// Observes a fixed list of section IDs and dispatches events:
// - `section-revealed` (detail: { id }) when a section first intersects
// - updates URL via history.replaceState for the top section (this triggers `locationchange` shim)

const SECTION_IDS = ['about','experience','projects','skills','education','contact']

if (typeof window !== 'undefined') {
  const els = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean)
  if (els.length === 0) {
    // nothing to observe on this page
    window.dispatchEvent(new CustomEvent('sections-none'))
  } else {
    let lastActive = ''
    const obs = new IntersectionObserver((entries) => {
      let best = { id: '', ratio: 0 }
      for (const e of entries) {
        const id = e.target.id
        if (e.isIntersecting) {
          window.dispatchEvent(new CustomEvent('section-revealed', { detail: { id } }))
        }
        if (e.intersectionRatio > best.ratio) {
          best = { id, ratio: e.intersectionRatio }
        }
      }
      if (best.id && best.id !== lastActive) {
        lastActive = best.id
        // update hash using replaceState so navigation is non-additive
        try {
          if (window.location.hash !== `#${best.id}`) {
            history.replaceState(null, '', `#${best.id}`)
          }
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('section-active', { detail: { id: best.id } }))
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-100px 0px -50% 0px' })

    els.forEach(el => obs.observe(el))
  }
}
