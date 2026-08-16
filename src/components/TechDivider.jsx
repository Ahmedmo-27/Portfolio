import React, { useMemo, useRef } from 'react'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import Terminal from 'lucide-react/dist/esm/icons/terminal'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'

const techIcons = [Code2, Terminal, Cpu]

const TechDivider = () => {
  const Icon = useMemo(() => techIcons[Math.floor(Math.random() * techIcons.length)], [])
  const ref = useRef(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return

      const pill = root.querySelector('.tech-divider-pill')
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([root, pill], { autoAlpha: 1, scale: 1, y: 0 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(root, { autoAlpha: 0 })
        if (pill) gsap.set(pill, { autoAlpha: 0, y: 6, scale: 0.9 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 90%',
            once: true,
          },
        })

        tl.to(root, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
        if (pill) {
          tl.to(pill, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25')
        }
      })

      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="tech-divider relative my-4 md:my-12">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="tech-divider-pill flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20">
          <Icon className="w-4 h-4 text-primary-400" />
          <div className="h-1 w-1 rounded-full bg-primary-400" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(TechDivider)
