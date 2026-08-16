import { useState, useRef, useCallback } from 'react'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import Medal from 'lucide-react/dist/esm/icons/medal'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import FileText from 'lucide-react/dist/esm/icons/file-text'
import Download from 'lucide-react/dist/esm/icons/download'
import { assetUrl } from '../utils/assetUrl'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
import { useSectionReveal } from '../hooks/useSectionReveal'

const achievements = [
  {
    id: 'vaultique',
    railLabel: 'Best Web Project',
    title: 'Best Web Project of 2025',
    organization: 'Misr International University',
    description:
      'Recognized for building Vaultique — a production e-commerce platform with JWT/Google OAuth, real-time inventory, 90%+ test coverage, and a Three.js configurator while leading a 5-member team.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    website: 'https://vaultique-puce.vercel.app',
  },
  {
    id: 'itida',
    railLabel: 'ITIDA Top 5',
    title: 'Top 5 — ITIDA Software Testing Day 2026',
    organization: 'ITIDA-SECC (4th Edition · 128 teams)',
    description:
      'Placed Top 5 with Debuggo, an AI-powered VS Code extension using AST-based analysis to generate context-aware tests across 1,000+ project files.',
    icon: Medal,
    color: 'from-emerald-400 to-teal-500',
    showProjectsLink: true,
  },
  {
    id: 'digitopia',
    railLabel: 'DIGITOPIA',
    title: 'Semifinalist in DIGITOPIA 2025',
    organization: 'Digitopia Competition — Cybersecurity',
    description:
      'Team reached semifinals with Cybertopia, a Cowrie-based honeypot platform analyzing 500K+ SSH attack logs from 300+ malicious IPs.',
    icon: Medal,
    color: 'from-slate-300 to-slate-400',
    showProjectsLink: true,
  },
  {
    id: 'nbe-letter',
    railLabel: 'NBE Letter',
    title: 'Recommendation Letter (NBE Internship)',
    organization: 'National Bank of Egypt (NBE)',
    description:
      'Received a recommendation letter from my internship supervisor for DevOps & automation contributions in live banking environments.',
    icon: FileText,
    color: 'from-blue-400 to-cyan-500',
    pdfUrl: '/Experience/NBE Letter of Recommendation.pdf',
  },
]

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Achievements() {
  const [activeIndex, setActiveIndex] = useState(0)
  const detailRef = useRef(null)
  const tabRefs = useRef([])
  const active = achievements[activeIndex]

  const scopeRef = useSectionReveal({
    itemSelector: '.achievements-split-panel',
    stagger: 0,
    y: 24,
  })

  const { contextSafe } = useGSAP(() => {}, { scope: scopeRef })

  const animateDetailSwap = contextSafe((nextIndex) => {
    const el = detailRef.current
    if (!el || prefersReducedMotion()) {
      setActiveIndex(nextIndex)
      return
    }

    gsap.to(el, {
      autoAlpha: 0,
      y: 10,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(nextIndex)
        requestAnimationFrame(() => {
          const nextEl = detailRef.current
          if (!nextEl) return
          gsap.fromTo(
            nextEl,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power2.out' }
          )
        })
      },
    })
  })

  const selectIndex = useCallback(
    (index) => {
      if (index === activeIndex || index < 0 || index >= achievements.length) return
      animateDetailSwap(index)
    },
    [activeIndex, animateDetailSwap]
  )

  const onRailKeyDown = (e, index) => {
    let next = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      next = (index + 1) % achievements.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      next = (index - 1 + achievements.length) % achievements.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      next = achievements.length - 1
    }
    if (next !== null) {
      selectIndex(next)
      requestAnimationFrame(() => tabRefs.current[next]?.focus())
    }
  }

  return (
    <section className="py-16 md:py-28 relative overflow-hidden" aria-labelledby="achievements-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4"
              style={{
                backgroundColor: 'var(--pill-ach-bg)',
                color: 'var(--pill-ach-fg)',
                borderColor: 'rgba(245, 158, 11, 0.22)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" aria-hidden="true" style={{ backgroundColor: 'var(--pill-ach-dot)' }} />
              Achievements
            </span>
            <h2 id="achievements-heading" className="section-heading mb-6">
              Recognition & <span className="gradient-text">Awards</span>
            </h2>
            <p className="section-subheading mx-auto">
              Highlights of accomplishments and recognition received throughout my academic and professional journey.
            </p>
          </div>

          <div className="achievements-split-panel gsap-reveal-item glass-card overflow-hidden border border-border/60 min-h-[22rem] md:min-h-[26rem]">
            <div className="grid lg:grid-cols-[minmax(0,34%)_minmax(0,66%)] lg:min-h-[26rem]">
              <div
                className="border-b lg:border-b-0 lg:border-r border-border/60 bg-surface/30 p-2 sm:p-3"
                role="tablist"
                aria-label="Achievements"
                aria-orientation="vertical"
              >
                <div className="flex flex-col gap-1">
                  {achievements.map((item, index) => {
                    const isActive = index === activeIndex
                    return (
                      <button
                        key={item.id}
                        ref={(node) => {
                          tabRefs.current[index] = node
                        }}
                        type="button"
                        role="tab"
                        id={`ach-tab-${item.id}`}
                        aria-selected={isActive}
                        aria-controls="ach-tabpanel"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => selectIndex(index)}
                        onKeyDown={(e) => onRailKeyDown(e, index)}
                        className={`group relative w-full text-left rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                          isActive
                            ? 'bg-primary-500/10 border border-primary-500/30 text-foreground'
                            : 'border border-transparent text-muted hover:bg-surface-hover hover:text-foreground'
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full transition-opacity ${
                            isActive ? 'bg-accent-amber opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex items-center gap-3 pl-1.5">
                          <span
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                            aria-hidden="true"
                          >
                            <item.icon className="w-4 h-4 text-dark-900" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm sm:text-base font-display font-semibold truncate">{item.railLabel}</span>
                            <span className="block text-[11px] sm:text-xs text-muted truncate mt-0.5">{item.organization}</span>
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div role="tabpanel" id="ach-tabpanel" aria-labelledby={`ach-tab-${active.id}`} className="p-4 sm:p-6 md:p-8">
                <div ref={detailRef}>
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div
                      className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      aria-hidden="true"
                    >
                      <active.icon className="w-6 md:w-7 h-6 md:h-7 text-dark-900" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground mb-1 leading-tight">
                        {active.title}
                      </h3>
                      <p className="dark:text-primary-400 text-primary-500 font-medium text-sm">{active.organization}</p>
                    </div>
                  </div>
                  <p className="text-muted text-sm sm:text-base leading-relaxed mb-5">{active.description}</p>
                  <div className="flex flex-wrap gap-4">
                    {active.website && (
                      <a
                        href={active.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                    {active.pdfUrl && (
                      <>
                        <a
                          href={assetUrl(active.pdfUrl)}
                          download
                          className="inline-flex items-center gap-1.5 dark:text-primary-400 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                          Download PDF
                        </a>
                        <a
                          href="/#experience"
                          className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                        >
                          View Experience
                        </a>
                      </>
                    )}
                    {active.showProjectsLink && (
                      <a
                        href="/#projects"
                        className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-500 transition-colors text-sm font-medium"
                      >
                        View Projects
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
