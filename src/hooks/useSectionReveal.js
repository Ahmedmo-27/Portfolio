import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'

/**
 * Shared section entrance: header children → reveal items → optional nested stagger.
 * Respects prefers-reduced-motion; ScrollTrigger once; auto-cleanup via useGSAP.
 */
export function useSectionReveal({
  headerSelector = '.gsap-section-header',
  itemSelector = '.gsap-reveal-item',
  nestedSelector = null,
  start = 'top 82%',
  y = 28,
  duration = 0.55,
  stagger = 0.08,
  nestedStagger = 0.025,
  nestedY = 10,
  setup,
  dependencies = [],
} = {}) {
  const scopeRef = useRef(null)

  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const targets = [
          ...gsap.utils.toArray(`${headerSelector} > *`, root),
          ...gsap.utils.toArray(itemSelector, root),
          ...(nestedSelector ? gsap.utils.toArray(nestedSelector, root) : []),
        ]
        gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: 'transform' })
        setup?.(root, null, true)
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const headerParts = gsap.utils.toArray(`${headerSelector} > *`, root)
        const items = gsap.utils.toArray(itemSelector, root)

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: root,
            start,
            once: true,
          },
        })

        if (headerParts.length) {
          gsap.set(headerParts, { autoAlpha: 0, y: 18 })
          tl.to(headerParts, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
          })
        }

        if (items.length) {
          gsap.set(items, { autoAlpha: 0, y })
          tl.to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration,
              stagger,
            },
            headerParts.length ? '-=0.25' : 0
          )

          if (nestedSelector) {
            items.forEach((item) => {
              const nested = gsap.utils.toArray(nestedSelector, item)
              if (!nested.length) return
              gsap.set(nested, { autoAlpha: 0, y: nestedY })
              tl.to(
                nested,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.35,
                  stagger: nestedStagger,
                },
                '-=0.35'
              )
            })
          }
        }

        setup?.(root, tl, false)
      })

      return () => mm.revert()
    },
    { scope: scopeRef, dependencies }
  )

  return scopeRef
}

/**
 * Animate newly inserted reveal items (Show More / expand).
 */
export function animateNewItems(container, selector = '.gsap-reveal-item-new', reduced = false) {
  if (!container) return
  const items = gsap.utils.toArray(selector, container)
  if (!items.length) return

  if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(items, { autoAlpha: 1, y: 0 })
    items.forEach((el) => el.classList.remove('gsap-reveal-item-new'))
    return
  }

  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.08,
      ease: 'power2.out',
      onComplete: () => {
        items.forEach((el) => el.classList.remove('gsap-reveal-item-new'))
      },
    }
  )
}

/**
 * Count-up helper for stat values like "10+", "1,000+", "3".
 */
export function animateStatCounters(statEls, timeline, position = '-=0.3') {
  if (!statEls?.length || !timeline) return

  statEls.forEach((el) => {
    const valueEl = el.querySelector('[data-stat-value]')
    if (!valueEl) return
    const raw = valueEl.getAttribute('data-stat-raw') || valueEl.textContent || '0'
    const suffix = raw.replace(/[\d,]/g, '')
    const hasComma = raw.includes(',')
    const end = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0
    const obj = { n: 0 }

    valueEl.textContent = hasComma ? `0${suffix}` : `0${suffix}`

    timeline.to(
      obj,
      {
        n: end,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          const rounded = Math.round(obj.n)
          valueEl.textContent = hasComma
            ? `${rounded.toLocaleString('en-US')}${suffix}`
            : `${rounded}${suffix}`
        },
      },
      position
    )
  })
}
