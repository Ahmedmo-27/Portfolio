import { useState, useRef, useCallback } from 'react'
import Users from 'lucide-react/dist/esm/icons/users'
import Star from 'lucide-react/dist/esm/icons/star'
import Heart from 'lucide-react/dist/esm/icons/heart'
import Rocket from 'lucide-react/dist/esm/icons/rocket'
import Crown from 'lucide-react/dist/esm/icons/crown'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import ViewMoreButton from './ViewMoreButton'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
import { useSectionReveal } from '../hooks/useSectionReveal'

const volunteeringExperiences = [
  {
    id: 'msp-president',
    railLabel: 'MSP President',
    organization: 'MSP – MIU Tech Club',
    role: 'President',
    period: 'Jul 2026 – Present',
    icon: Crown,
    color: 'from-amber-500 to-yellow-500',
    description:
      'Leading the MSP–MIU Tech Club as President after serving as Head of Software Development — setting direction across departments, representing the club, and driving technical and community initiatives.',
    achievements: [
      'Elected President after leading the software development department since Sep 2025',
      'Overseeing club strategy, cross-department coordination, and public representation of MSP–MIU',
      'Continuing to mentor teams and support delivery of the official club platform serving 200+ users',
      'Fostering collaboration, technical sessions, and member growth across the organization',
    ],
  },
  {
    id: 'msp-head',
    railLabel: 'MSP Head of SD',
    organization: 'MSP – MIU Tech Club',
    role: 'Head of Software Development',
    period: 'Sep 2025 – Jun 2026',
    icon: Rocket,
    color: 'from-violet-500 to-purple-500',
    description:
      'Provided leadership, mentoring, coordination, and public speaking for a 25+ member software team through technical sessions and project leadership.',
    achievements: [
      'Led and mentored a 25+ member software team, coordinating project delivery across departments',
      'Reviewed technical work and supported junior developers through collaborative development practices',
      'Hosted technical sessions covering architecture, testing, and CI/CD practices',
      'Led development of the official club website and Android app (React, Node.js, MySQL, Capacitor)',
    ],
  },
  {
    id: 'sprints',
    railLabel: 'Sprints',
    organization: 'Sprints',
    role: 'Student Ambassador',
    period: 'Nov 2025 – Present',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    description:
      'Representing Sprints at MIU by communicating opportunities, coordinating outreach activities, and building relationships with students.',
    achievements: [
      'Acted as a liaison between Sprints and university students to promote tech opportunities',
      'Coordinated outreach activities and info sessions on campus',
      'Helped students discover relevant learning paths and resources',
    ],
  },
  {
    id: 'mun',
    railLabel: 'MIU MUN',
    organization: 'MIU - Model United Nations & Arab League',
    role: 'Delegate (ICJ Council)',
    period: 'Sep 2023 – May 2024',
    icon: Star,
    color: 'from-amber-500 to-yellow-500',
    description:
      'Participated as a delegate in ICJ Council simulations, developing public speaking and cross-cultural collaboration skills.',
    achievements: [
      'Held a key role in the ICJ Council, excelling in research, debate, and resolution drafting',
    ],
  },
  {
    id: 'ieee',
    railLabel: 'IEEE MIU',
    organization: 'IEEE MIU SB',
    role: 'Public Relations Specialist',
    period: 'Sep 2024 – May 2025',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description:
      'Handled public relations and communication efforts to support IEEE MIU SB events and initiatives.',
    achievements: [
      'Coordinated student activities and communication strategies to boost engagement',
      'Collaborated with teams to promote key events and technical sessions',
      'Helped grow event participation and visibility across the student community',
    ],
  },
]

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Volunteering() {
  const [activeIndex, setActiveIndex] = useState(0)
  const detailRef = useRef(null)
  const tabRefs = useRef([])
  const active = volunteeringExperiences[activeIndex]

  const scopeRef = useSectionReveal({
    itemSelector: '.volunteering-split-panel',
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
      if (index === activeIndex || index < 0 || index >= volunteeringExperiences.length) return
      animateDetailSwap(index)
    },
    [activeIndex, animateDetailSwap]
  )

  const onRailKeyDown = (e, index) => {
    let next = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      next = (index + 1) % volunteeringExperiences.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      next = (index - 1 + volunteeringExperiences.length) % volunteeringExperiences.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      next = volunteeringExperiences.length - 1
    }
    if (next !== null) {
      selectIndex(next)
      requestAnimationFrame(() => tabRefs.current[next]?.focus())
    }
  }

  return (
    <section className="py-16 md:py-28 relative overflow-hidden" aria-labelledby="volunteering-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden="true" />
              Volunteering
            </span>
            <h2 id="volunteering-heading" className="section-heading mb-6">
              Community <span className="gradient-text">Involvement</span>
            </h2>
            <p className="section-subheading mx-auto">
              Active participation in student organizations and leadership roles that shaped collaborative and management skills.
            </p>
          </div>

          <div className="volunteering-split-panel gsap-reveal-item glass-card overflow-hidden border border-border/60 min-h-[24rem] md:min-h-[28rem]">
            <div className="grid lg:grid-cols-[minmax(0,34%)_minmax(0,66%)] lg:min-h-[28rem]">
              <div
                className="border-b lg:border-b-0 lg:border-r border-border/60 bg-surface/30 p-2 sm:p-3"
                role="tablist"
                aria-label="Volunteering roles"
                aria-orientation="vertical"
              >
                <div className="flex flex-col gap-1">
                  {volunteeringExperiences.map((exp, index) => {
                    const isActive = index === activeIndex
                    return (
                      <button
                        key={exp.id}
                        ref={(node) => {
                          tabRefs.current[index] = node
                        }}
                        type="button"
                        role="tab"
                        id={`vol-tab-${exp.id}`}
                        aria-selected={isActive}
                        aria-controls="vol-tabpanel"
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
                            isActive ? 'bg-accent-emerald opacity-100' : 'opacity-0'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="flex items-center gap-3 pl-1.5">
                          <span
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                            aria-hidden="true"
                          >
                            <exp.icon className="w-4 h-4 text-white" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm sm:text-base font-display font-semibold truncate">{exp.railLabel}</span>
                            <span className="block text-[11px] sm:text-xs text-muted truncate mt-0.5">{exp.period}</span>
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div role="tabpanel" id="vol-tabpanel" aria-labelledby={`vol-tab-${active.id}`} className="p-4 sm:p-6 md:p-8">
                <div ref={detailRef}>
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div
                      className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      aria-hidden="true"
                    >
                      <active.icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-1">{active.organization}</h3>
                      <p className="dark:text-primary-400 text-primary-500 font-medium text-sm">{active.role}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <time>{active.period}</time>
                      </p>
                    </div>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-4">{active.description}</p>
                  <ul className="space-y-2 mb-6" role="list">
                    {active.achievements.map((item, i) => (
                      <li key={`${active.id}-a-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <ViewMoreButton
              href="https://msp-miu.tech"
              text="Visit MSP-MIU Website"
              variant="primary"
              icon={ExternalLink}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
