import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Calendar, Award, BookOpen, ExternalLink, BadgeCheck, ChevronUp } from 'lucide-react'
import './Education.css'

const education = {
  university: 'Misr International University (MIU)',
  degree: 'Bachelor of Science in Software Engineering',
  status: 'Junior (3rd Year)',
  expectedGraduation: 'Expected: 2026',
  location: 'Cairo, Egypt',
  gpa: '3.5/4.0',
  highlights: [
    'Focus on Software Engineering and Cloud Computing',
    'Best Web Project Award (Vaultique) - 2025',
    'Active member of Microsoft Student Partners (MSP)',
    'Completed coursework in Data Structures, Algorithms, Databases, and Software Architecture',
  ],
}

// Licenses & Certifications (compact grid, styled similarly to Projects cards)
const certifications = [
  {
    id: 'azure-cloud-concepts',
    title: 'Introduction to Microsoft Azure: Describe cloud concepts',
    issuer: 'Microsoft',
    date: 'Sep 2025',
    type: 'Course',
    credentialId: null,
    color: 'from-sky-500 to-blue-500',
    skills: ['Cloud Computing'],
    link: '#',
    verified: true,
  },
  {
    id: 'sprints-devops-foundations',
    title: 'Sprints x Microsoft Summer Camp - DevOps Foundations',
    issuer: 'Sprints x Microsoft',
    date: 'Sep 2025',
    type: 'Bootcamp',
    credentialId: 'ID - SPR - 1J04S5',
    color: 'from-blue-500 to-cyan-500',
    skills: ['Containerization', 'AWS', 'Cloud Computing', 'Docker'],
    link: '#',
    verified: true,
  },
  {
    id: 'almentor-first-time-employee',
    title: 'First-Time Employee',
    issuer: 'almentor',
    date: 'Jul 2025',
    type: 'Course Certificate',
    credentialId: 'ejrgidgyx8',
    color: 'from-emerald-500 to-teal-500',
    skills: ['Career Readiness', 'Workplace Culture'],
    link: '#',
    verified: true,
  },
  {
    id: 'almentor-communication',
    title: 'Mastering Effective Communication Skills',
    issuer: 'almentor',
    date: 'Jul 2025',
    type: 'Course Certificate',
    credentialId: 'mosnrpl1',
    color: 'from-violet-500 to-purple-500',
    skills: ['Communication', 'Presentation'],
    link: '#',
    verified: true,
  },
  {
    id: 'almentor-work-ethics',
    title: 'Work Ethics',
    issuer: 'almentor',
    date: 'Jul 2025',
    type: 'Course Certificate',
    credentialId: 'nvxaqlr57',
    color: 'from-amber-500 to-orange-500',
    skills: ['Work Ethics', 'Professionalism'],
    link: '#',
    verified: true,
  },
  {
    id: 'odc-istqb',
    title: 'ISTQB® Course',
    issuer: 'Orange Digital Center Egypt',
    date: 'Feb 2025',
    type: 'Course',
    credentialId: null,
    color: 'from-rose-500 to-red-500',
    skills: [
      'Manual Testing',
      'Functional Testing',
      'Test Automation',
      'STLC',
      'QA',
    ],
    link: '#',
    verified: true,
  },
  {
    id: 'linkedin-selenium',
    title: 'Learning Selenium',
    issuer: 'LinkedIn Learning',
    date: 'Feb 2025',
    type: 'Course Certificate',
    credentialId: null,
    color: 'from-indigo-500 to-blue-500',
    skills: ['Selenium', 'Test Automation', 'Selenium WebDriver'],
    link: '#',
    verified: true,
  },
  {
    id: 'linkedin-testing-foundations',
    title: 'Programming Foundations: Software Testing/QA',
    issuer: 'LinkedIn Learning',
    date: 'Feb 2025',
    type: 'Course Certificate',
    credentialId: null,
    color: 'from-slate-500 to-sky-500',
    skills: ['Software QA', 'Software Testing'],
    link: '#',
    verified: true,
  },
  {
    id: 'scaler-cpp-essentials',
    title: 'C++ Course: Learn the Essentials',
    issuer: 'Scaler',
    date: 'Jun 2024',
    type: 'Course Certificate',
    credentialId: null,
    color: 'from-cyan-500 to-emerald-500',
    skills: ['C++'],
    link: '#',
    verified: true,
  },
  {
    id: 'ctc-english-level-16',
    title:
      'English Language Level 16 (General English, Phonetics, Conversation, Business English, Translation)',
    issuer: 'Cambridge Training College Britain',
    date: 'Aug 2022',
    type: 'Diploma',
    credentialId: '25032062820',
    color: 'from-blue-500 to-indigo-500',
    skills: ['English', 'Translation', 'Business English'],
    link: '#',
    verified: true,
  },
  {
    id: 'goethe-a2-german',
    title: 'A2 German',
    issuer: 'Goethe-Institut Kairo',
    date: 'Feb 2019',
    type: 'Language Certificate',
    credentialId: null,
    color: 'from-emerald-500 to-lime-500',
    skills: ['German'],
    link: '#',
    verified: true,
  },
]

const coursework = [
  'Data Structures & Algorithms',
  'Database Systems',
  'Software Architecture',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Mobile App Development',
  'Cloud Computing',
]

export default function Education() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [showAllCerts, setShowAllCerts] = useState(false)

  // Show a subset of certifications by default to keep layout compact
  const CERTS_INITIAL_DISPLAY = 6
  const displayedCertifications = showAllCerts
    ? certifications
    : certifications.slice(0, CERTS_INITIAL_DISPLAY)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: '-100px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section 
      id="education" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="education-heading"
    >
      {/* Background Elements */}
      <div className="education-bg-blur-1" aria-hidden="true" />
      <div className="education-bg-blur-2" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
              Education & Certifications
            </span>
            <h2 id="education-heading" className="section-heading mb-6">
              Academic <span className="gradient-text">Background</span>
            </h2>
            <p className="section-subheading mx-auto">
              My educational journey and professional certifications that have shaped 
              my expertise in software engineering and development.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 education-layout">
            {/* Education Card */}
            <div className={`${isInView ? 'animate-fade-in-up animate-delay-2' : 'opacity-0'} lg:col-span-2`}>
              <div className="glass-card p-6 md:p-8 h-full">
                {/* University Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                    aria-hidden="true"
                  >
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1">
                      {education.university}
                    </h3>
                    <p className="text-primary-400 font-medium text-sm md:text-base">
                      {education.degree}
                    </p>
                  </div>
                </div>

                {/* Education Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-sm">
                      <BookOpen className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
                      <span className="text-muted">{education.status}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-sm">
                      <Calendar className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
                      <span className="text-muted">{education.expectedGraduation}</span>
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
                    Highlights
                  </h4>
                  <ul className="space-y-2" role="list">
                    {education.highlights.map((highlight, index) => (
                      <li 
                        key={`education-highlight-${index}`} 
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relevant Coursework */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" aria-hidden="true" />
                    Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {coursework.map((course) => (
                      <span 
                        key={course} 
                        className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-muted hover:text-foreground hover:border-primary-500/30 transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Certifications */}
            <div className={`${isInView ? 'animate-fade-in-up animate-delay-2' : 'opacity-0'} lg:col-span-3`}>
              <div className="space-y-5 md:space-y-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-accent-emerald" />
                    Licenses & Certifications
                  </h3>
                  <span className="text-[11px] uppercase tracking-wide text-muted/70">
                    {certifications.length} credentials
                  </span>
                </div>

                {/* Primary approach: compact grid of cards (Projects-like, smaller) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
                  {displayedCertifications.map((cert, index) => (
                    <article
                      key={cert.id}
                      ref={(el) => {
                        if (el) el.style.setProperty('--animation-delay', `${index * 0.08 + 0.25}s`)
                      }}
                      className={`glass-card p-4 sm:p-5 group relative overflow-hidden transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 education-cert-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                      tabIndex={0}
                      aria-label={cert.title}
                    >
                      {/* Background glow on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 group-focus-visible:opacity-15 blur-3xl transition-opacity pointer-events-none`}
                        aria-hidden="true"
                      />

                      <div className="relative flex items-start gap-3">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          aria-hidden="true"
                        >
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[13px] sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 flex items-center gap-1.5">
                                {cert.title}
                                {cert.verified && (
                                  <BadgeCheck
                                    className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0"
                                    aria-label="Verified certification"
                                  />
                                )}
                              </p>
                              <p className="text-[11px] sm:text-xs font-medium text-primary-400 truncate">
                                {cert.issuer}
                              </p>
                            </div>
                            <span className="text-[10px] text-muted/70 flex-shrink-0">
                              {cert.date}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-2 py-0.5 border border-border/60 text-[10px] text-muted">
                              <span className="w-1 h-1 rounded-full bg-accent-emerald" aria-hidden="true" />
                              {cert.type}
                            </span>
                            {cert.credentialId && (
                              <span className="text-[10px] text-muted/70 truncate">
                                ID: {cert.credentialId}
                              </span>
                            )}
                          </div>

                          {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cert.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={`${cert.id}-${skill}`}
                                  className="rounded-full bg-surface/80 px-1.5 py-0.5 text-[10px] text-muted border border-border/60"
                                >
                                  {skill}
                                </span>
                              ))}
                              {cert.skills.length > 3 && (
                                <span className="text-[10px] text-primary-400">
                                  +{cert.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {cert.link && (
                            <a
                              href={cert.link}
                              target={cert.link.startsWith('http') ? '_blank' : undefined}
                              rel={cert.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                            >
                              Show credential
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {certifications.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCerts((prev) => !prev)}
                    className="mx-auto mt-2 text-[11px] sm:text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                  >
                    {showAllCerts ? 'Show fewer certifications' : 'Show all certifications'}
                    <ChevronUp
                      className={`w-3 h-3 transition-transform ${showAllCerts ? '' : 'rotate-180'}`}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {/* Alternative approach (if ever needed): switch to a simple stacked list.
                    Keeping the grid as the primary UX to match the Projects style
                    while remaining compact and scannable. */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

