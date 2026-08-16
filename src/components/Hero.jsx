import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Download from 'lucide-react/dist/esm/icons/download'
import Mail from 'lucide-react/dist/esm/icons/mail'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import Github from 'lucide-react/dist/esm/icons/github'
import Linkedin from 'lucide-react/dist/esm/icons/linkedin'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
const ProfileCard = lazy(() => import('./ProfileCard'))
import { assetUrl } from '../utils/assetUrl'
import SkeletonLoader from './SkeletonLoader'

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef(null)
  const scrollBounceRef = useRef(null)

  useEffect(() => {
    const handleLoad = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setIsLoading(false)
        }, { timeout: 500 })
      } else {
        setTimeout(() => setIsLoading(false), 500)
      }
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  useGSAP(
    () => {
      if (isLoading) return

      const root = sectionRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            '.hero-badge',
            '.hero-name',
            '.hero-title-block',
            '.hero-ctas > *',
            '.hero-socials > *',
            '.hero-profile-wrap',
            '.hero-scroll-bounce',
          ],
          { autoAlpha: 1, y: 0, clearProps: 'transform' }
        )
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const badge = root.querySelector('.hero-badge')
        const name = root.querySelector('.hero-name')
        const title = root.querySelector('.hero-title-block')
        const ctas = gsap.utils.toArray('.hero-ctas > *', root)
        const socials = gsap.utils.toArray('.hero-socials > *', root)
        const profile = root.querySelector('.hero-profile-wrap')
        const scrollEl = scrollBounceRef.current

        const enterTargets = [badge, name, title, ...ctas, ...socials, profile].filter(Boolean)
        gsap.set(enterTargets, { autoAlpha: 0, y: 28 })
        if (scrollEl) gsap.set(scrollEl, { autoAlpha: 0 })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (badge) tl.to(badge, { autoAlpha: 1, y: 0, duration: 0.45 })
        if (name) tl.to(name, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.2')
        if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.28')
        if (ctas.length) {
          tl.to(ctas, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 }, '-=0.25')
        }
        if (socials.length) {
          tl.to(socials, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, '-=0.2')
        }
        if (profile) {
          tl.to(profile, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.45')
        }
        if (scrollEl) {
          tl.to(scrollEl, { autoAlpha: 1, duration: 0.4 }, '-=0.2')
          const bounce = gsap.to(scrollEl, {
            y: 8,
            duration: 0.9,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            delay: 0.2,
          })

          const killBounce = () => {
            bounce.kill()
            gsap.to(scrollEl, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' })
            window.removeEventListener('scroll', killBounce)
          }
          window.addEventListener('scroll', killBounce, { passive: true, once: true })

          return () => {
            bounce.kill()
            window.removeEventListener('scroll', killBounce)
          }
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [isLoading], revertOnUpdate: true }
  )

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pb-25"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="tech-grid" />
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1 hero-col-preserve">
            <div className="mb-4 md:mb-6 flex justify-center lg:justify-start">
              {isLoading ? (
                <SkeletonLoader variant="text" className="h-8 w-40 rounded-full" style={{ minWidth: '160px' }} />
              ) : (
                <span className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass text-xs md:text-sm text-muted">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                  Open to Opportunities
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <SkeletonLoader variant="text" className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-full max-w-md mx-auto lg:mx-0 rounded-lg" style={{ minWidth: '360px' }} />
              </div>
            ) : (
              <h1 className="hero-name text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-3 md:mb-4">
                <span className="text-foreground">Ahmed</span>{' '}
                <span className="gradient-text">Mostafa</span>
              </h1>
            )}

            <div className="mb-4 md:mb-6">
              {isLoading ? (
                <div className="space-y-2 max-w-sm mx-auto lg:mx-0">
                  <SkeletonLoader variant="text" className="h-6 sm:h-7 md:h-8 lg:h-9 w-full rounded-md" />
                  <SkeletonLoader variant="text" className="h-5 sm:h-6 md:h-7 lg:h-8 w-full rounded-md" />
                </div>
              ) : (
                <div className="hero-title-block">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted font-light tracking-wide font-mono">
                    <span className="text-primary-400">&lt;</span>
                    <span className="text-primary-400">Junior Software Engineer</span>
                    <span className="text-primary-400">/&gt;</span>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted font-light tracking-wide mt-2">
                    <Code2 className="inline w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-primary-400" />
                    <span className="text-primary-400">Backend & Full-Stack</span>
                    <span className="mx-2 text-border">|</span>
                    <span>DevOps Interest</span>
                  </p>
                </div>
              )}
            </div>

            <div className="hero-ctas flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
              {isLoading ? (
                <>
                  <SkeletonLoader variant="text" className="h-10 md:h-12 w-32 rounded-lg" style={{ minWidth: '128px' }} />
                  <SkeletonLoader variant="text" className="h-10 md:h-12 w-28 rounded-lg" style={{ minWidth: '112px' }} />
                  <SkeletonLoader variant="text" className="h-10 md:h-12 w-32 rounded-lg" style={{ minWidth: '128px' }} />
                </>
              ) : (
                <>
                  <a
                    href={assetUrl("Ahmed Mostafa's Full-Stack CV.pdf")}
                    download
                    className="btn-primary text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
                    target="_blank"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    Download CV
                  </a>
                  <a href="#contact" className="btn-secondary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                    <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    Contact Me
                  </a>
                  <a href="#projects" className="btn-secondary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                    View Projects
                  </a>
                </>
              )}
            </div>

            <div className="hero-socials flex items-center justify-center lg:justify-start gap-2 md:gap-3">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} variant="avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-xl" style={{ minWidth: '40px', minHeight: '40px' }} />
                ))
              ) : (
                <>
                  <a
                    href="https://github.com/ahmedmo-27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                    aria-label="GitHub profile"
                  >
                    <Github className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://linkedin.com/in/ahmedmostafa-swe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                  </a>
                  <a
                    href="mailto:ahmedmostafa.swe1@gmail.com"
                    className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                    aria-label="Email Ahmed Mostafa"
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="hero-profile-wrap order-1 lg:order-2 flex justify-center lg:justify-end mb-6 md:mb-0">
            <Suspense
              fallback={
                <SkeletonLoader
                  variant="card"
                  className="w-full max-w-xs sm:max-w-sm rounded-3xl"
                  style={{ height: 'min(80vh, 540px)', maxHeight: '540px', aspectRatio: '0.718', minHeight: '400px' }}
                />
              }
            >
              <ProfileCard className="w-full max-w-xs sm:max-w-sm" />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 hero-scroll-indicator z-20">
        <div ref={scrollBounceRef} className="hero-scroll-bounce flex flex-col items-center gap-2 text-muted">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-primary-400">scroll</span>
            <span className="text-border">(</span>
            <span className="text-accent-cyan">↓</span>
            <span className="text-border">)</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(Hero)
