import { useState, useRef, useCallback } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Code from 'lucide-react/dist/esm/icons/code'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import Server from 'lucide-react/dist/esm/icons/server'
import { useGSAP } from '@gsap/react'
import { gsap } from '../utils/gsapSetup'
import ExperienceDetail from './ExperienceDetail'

const experiences = [
  {
    id: 'el-zatuna',
    railLabel: 'El Zatuna',
    company: 'El Zatuna',
    role: 'Full-Stack Developer — Part-time',
    period: 'Jan 2026 – Present',
    location: 'Remote · Cairo, Egypt',
    icon: Server,
    color: 'from-purple-500 to-violet-500',
    highlights: [
      'El Zatuna LMS: Delivered backend features for a production LMS used by 100+ users — REST APIs, Cloudflare R2 media (2GB+ uploads), email (Cloudflare & Brevo), and Zoom/Stripe/Geidea integrations',
      'Built CI/CD pipelines with GitHub Actions and DigitalOcean for LMS deployments',
      'The Mind Space (TMS): Shipped full-stack features across a Node.js/TypeScript API, Next.js admin, and Flutter app for 1,000+ members — multi-role/multi-branch access, bookings, Socket.io, QR attendance, Firebase, and payments',
    ],
    tags: ['Laravel', 'MySQL', 'Node.js', 'TypeScript', 'Express', 'MongoDB', 'Next.js', 'Flutter', 'Socket.io', 'Cloudflare R2', 'Stripe', 'Geidea', 'GitHub Actions', 'DigitalOcean'],
    documents: [{ label: 'El Zatuna Website', href: 'https://elzatuna.com/' }],
  },
  {
    id: 'nbe',
    railLabel: 'NBE',
    company: 'National Bank of Egypt (NBE)',
    role: 'Live Environment Support (DevOps & Automation) Intern — Onsite',
    period: 'Jul 2025 – Aug 2025',
    location: 'Cairo, Egypt',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    highlights: [
      'Automated mission-critical deployment pipelines for 10+ Oracle-based and Windows banking systems, collaborating with UAT and operations teams to reduce manual production errors',
      'Built a Bash/PowerShell automation toolkit (disk validation, cleanup, backups) adopted by the DevOps team to streamline banking infrastructure operations',
      'Gained hands-on experience with UAT and production deployments in a live banking environment',
    ],
    tags: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Automation', 'Oracle', 'Linux'],
    documents: [{ label: 'Recommendation Letter (PDF)', href: '/Experience/NBE Letter of Recommendation.pdf' }],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/NBE.jpg' }],
  },
  {
    id: 'depi',
    railLabel: 'DEPI',
    company: 'DEPI – Digital Egyptian Pioneers Initiative',
    role: 'Android Mobile App Developer',
    period: 'Jun 2025 – Dec 2025',
    location: 'Hybrid (Cairo, Egypt)',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    highlights: [
      'Developed Android apps using Kotlin, Jetpack Compose, Room, Retrofit',
      'Worked on Cinemeteor capstone project',
      'Implemented TMDB API handling, caching, reviews, similar movies, and loading UX',
      'Contributed to Firebase integration, testing, documentation',
      'Awarded Achiever Level Certificate',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Firebase', 'XML'],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/Ahmed Mostafa Anwar DEPI.pdf' }],
  },
  {
    id: 'itida',
    railLabel: 'ITIDA Gigs',
    company: 'ITIDA Gigs Freelancing Program',
    role: 'Freelancing Software Tester — Remote',
    period: 'Feb 2025 – May 2025',
    location: 'Cairo, Egypt',
    icon: Code,
    color: 'from-orange-500 to-amber-500',
    highlights: [
      'Collaborated with project stakeholders to design structured test cases and automated tests with Selenium and Postman',
      'Improved defect detection by 25% through systematic manual and automated testing',
      'Recognized as top achiever in the freelancing program',
    ],
    tags: ['Selenium', 'Postman', 'API Testing', 'Automation', 'QA'],
    documents: [{ label: 'Program Certificate', href: '/Experience/ITIDA + GIGS.jpg' }],
  },
  {
    id: 'fuzetek',
    railLabel: 'Fuzetek',
    company: 'Fuzetek',
    role: 'Software Engineering Intern',
    period: 'Feb 2025 – Apr 2025',
    location: 'Remote',
    icon: Cpu,
    color: 'from-indigo-500 to-blue-500',
    highlights: [
      'Ranked in the top 5% among 300+ interns',
      'Solved 50+ problems in Python and C++',
      'Participated in coding sessions, debugging, and testing tasks',
      'Worked across small development projects',
    ],
    tags: ['Python', 'C++', 'Problem Solving', 'Debugging', 'Testing'],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/Fuzetek.jpg' }],
    documents: [{ label: 'Achiever Post', href: '/Experience/Achiever Post.png' }],
  },
]

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scopeRef = useRef(null)
  const detailRef = useRef(null)
  const tabRefs = useRef([])
  const active = experiences[activeIndex]

  const { contextSafe } = useGSAP(
    () => {
      const root = scopeRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            ...gsap.utils.toArray('.gsap-section-header > *', root),
            '.experience-split-panel',
          ],
          { autoAlpha: 1, y: 0, clearProps: 'transform' }
        )
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const headerParts = gsap.utils.toArray('.gsap-section-header > *', root)
        const panel = root.querySelector('.experience-split-panel')

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
          },
        })

        if (headerParts.length) {
          gsap.set(headerParts, { autoAlpha: 0, y: 18 })
          tl.to(headerParts, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 })
        }

        if (panel) {
          gsap.set(panel, { autoAlpha: 0, y: 24 })
          tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.25')
        }
      })

      return () => mm.revert()
    },
    { scope: scopeRef }
  )

  const animateDetailSwap = contextSafe((nextIndex) => {
    const el = detailRef.current
    if (!el) {
      setActiveIndex(nextIndex)
      return
    }

    if (prefersReducedMotion()) {
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
      if (index === activeIndex || index < 0 || index >= experiences.length) return
      animateDetailSwap(index)
    },
    [activeIndex, animateDetailSwap]
  )

  const onRailKeyDown = (e, index) => {
    let next = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      next = (index + 1) % experiences.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      next = (index - 1 + experiences.length) % experiences.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      next = experiences.length - 1
    }

    if (next !== null) {
      selectIndex(next)
      requestAnimationFrame(() => {
        tabRefs.current[next]?.focus()
      })
    }
  }

  return (
    <section
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4"
              style={{
                backgroundColor: 'var(--pill-exp-bg)',
                color: 'var(--pill-exp-fg)',
                borderColor: 'rgba(16, 185, 129, 0.25)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                aria-hidden="true"
                style={{ backgroundColor: 'var(--pill-exp-dot)' }}
              />
              Experience
            </span>
            <h2 id="experience-heading" className="section-heading mb-6">
              Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subheading mx-auto">
              A track record of impactful contributions across internships,
              freelance projects, and academic achievements.
            </p>
          </div>

          <div className="experience-split-panel glass-card overflow-hidden border border-border/60 min-h-[28rem] md:min-h-[32rem]">
            <div className="grid lg:grid-cols-[minmax(0,34%)_minmax(0,66%)] lg:min-h-[32rem]">
              {/* Company rail */}
              <div
                className="border-b lg:border-b-0 lg:border-r border-border/60 bg-surface/30 p-2 sm:p-3"
                role="tablist"
                aria-label="Work experience roles"
                aria-orientation="vertical"
              >
                <div className="flex flex-col gap-1">
                  {experiences.map((exp, index) => {
                    const isActive = index === activeIndex
                    return (
                      <button
                        key={exp.id}
                        ref={(node) => {
                          tabRefs.current[index] = node
                        }}
                        type="button"
                        role="tab"
                        id={`exp-tab-${exp.id}`}
                        aria-selected={isActive}
                        aria-controls="exp-tabpanel"
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
                            isActive ? 'bg-primary-400 opacity-100' : 'opacity-0'
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
                            <span className="block text-sm sm:text-base font-display font-semibold truncate">
                              {exp.railLabel}
                            </span>
                            <span className="block text-[11px] sm:text-xs text-muted truncate mt-0.5">
                              {exp.period}
                            </span>
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Detail pane */}
              <div
                role="tabpanel"
                id="exp-tabpanel"
                aria-labelledby={`exp-tab-${active.id}`}
                className="p-4 sm:p-6 md:p-8"
              >
                <div ref={detailRef}>
                  <ExperienceDetail exp={active} index={activeIndex} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
