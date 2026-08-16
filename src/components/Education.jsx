import { useState, useEffect, useRef } from 'react'
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap'
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import BookOpen from 'lucide-react/dist/esm/icons/book-open'
import BadgeCheck from 'lucide-react/dist/esm/icons/badge-check'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import { useSectionReveal, animateNewItems } from '../hooks/useSectionReveal'
import EducationCertCard from './EducationCertCard'

const education = {
  university: 'Misr International University (MIU)',
  degree: 'Bachelor of Computer Science, Major: Software Engineering',
  status: 'Class of 2027',
  expectedGraduation: 'Expected: July 2027',
  location: 'Cairo, Egypt',
  highlights: [
    'Oct 2023 – Present · Focus on Software Engineering and full-stack systems',
    'President, MSP – MIU Tech Club (previously Head of Software Development)',
    'Award-winning projects: Best Web Project MIU 2025, ITIDA Top 5, Digitopia Semifinalist',
  ],
}

const certifications = [
  {
    id: 'build-with-ai',
    title: 'Build With AI',
    issuer: 'Google x ITI',
    date: '2025',
    type: 'Program',
    color: 'from-emerald-500 to-teal-500',
    skills: ['AI', 'Generative AI', 'Google Cloud'],
    link: null,
  },
  {
    id: 'azure-cloud-concepts',
    title: 'Introduction to Microsoft Azure: Describe cloud concepts',
    issuer: 'Microsoft',
    date: 'Sep 2025',
    type: 'Course',
    color: 'from-sky-500 to-blue-500',
    skills: ['Cloud Computing'],
    link: 'https://learn.microsoft.com/en-us/users/ahmedmostafa-2739/achievements/q5psmbce?ref=https%3A%2F%2F',
  },
  {
    id: 'sprints-devops-foundations',
    title: 'DevOps Foundations',
    issuer: 'Sprints x Microsoft',
    date: 'Sep 2025',
    type: 'Bootcamp',
    color: 'from-blue-500 to-cyan-500',
    skills: ['Containerization', 'AWS', 'Cloud Computing', 'Docker'],
    link: 'https://sprints.ai/en-eg/journeys/learning/ID%20-%20SPR%20-%201J04S5/view-certificate-serial',
  },
  {
    id: 'odc-istqb',
    title: 'ISTQB Foundation',
    issuer: 'Orange Digital Center Egypt',
    date: 'Feb 2025',
    type: 'Course',
    color: 'from-amber-500 to-orange-500',
    skills: [
      'Manual Testing',
      'Functional Testing',
      'Test Automation',
      'STLC',
      'QA',
    ],
    link: '/Certificates/ISTQB Foundations ODC.jpg',
  },
  {
    id: 'linkedin-selenium',
    title: 'Learning Selenium',
    issuer: 'LinkedIn Learning',
    date: 'Feb 2025',
    type: 'Course Certificate',
    color: 'from-indigo-500 to-blue-500',
    skills: ['Selenium', 'Test Automation', 'Selenium WebDriver'],
    link: 'https://www.linkedin.com/learning/certificates/7a699f72b731343cd7f7c99e9c1f6f9532949d8da03bd8c6c80879bd2211e8e4?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BdoZ7TmQQQjSZgZwOhm8HNg%3D%3D',
  },
  {
    id: 'linkedin-testing-foundations',
    title: 'Programming Foundations: Software Testing/QA',
    issuer: 'LinkedIn Learning',
    date: 'Feb 2025',
    type: 'Course Certificate',
    color: 'from-slate-500 to-sky-500',
    skills: ['Software QA', 'Software Testing'],
    link: 'https://www.linkedin.com/learning/certificates/1deb502ef86347d4fdfd89a14944755c9e3cf60f3ce271d5dbd74240383049c9?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BdoZ7TmQQQjSZgZwOhm8HNg%3D%3D',
  },
  {
    id: 'scaler-cpp-essentials',
    title: 'C++ Course: Learn the Essentials',
    issuer: 'Scaler',
    date: 'Jun 2024',
    type: 'Course Certificate',
    color: 'from-cyan-500 to-emerald-500',
    skills: ['C++'],
    link: 'https://moonshot.scaler.com/s/li/3OObsvS0Ws',
  },
  {
    id: 'goethe-a2-german',
    title: 'A2 German',
    issuer: 'Goethe-Institut',
    date: '2024',
    type: 'Language Certificate',
    color: 'from-rose-500 to-orange-500',
    skills: ['German', 'A2'],
    link: null,
  },
]

const coursework = [
  'Algorithm Analysis & Design',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Artificial Intelligence',
]

export default function Education() {
  const [expandedCertSkills, setExpandedCertSkills] = useState({})
  const [showAllCerts, setShowAllCerts] = useState(false)
  const prevShowAllRef = useRef(false)
  const certsGridRef = useRef(null)

  const scopeRef = useSectionReveal({
    itemSelector: '.gsap-reveal-item',
    stagger: 0.08,
  })

  const toggleCertSkills = (certId) => {
    setExpandedCertSkills((prev) => ({
      ...prev,
      [certId]: !prev[certId],
    }))
  }

  const displayedCerts = showAllCerts ? certifications : certifications.slice(0, 4)
  const hasMoreCerts = certifications.length > 4

  useEffect(() => {
    if (showAllCerts && !prevShowAllRef.current && certsGridRef.current) {
      requestAnimationFrame(() => {
        animateNewItems(certsGridRef.current)
      })
    }
    prevShowAllRef.current = showAllCerts
  }, [showAllCerts])

  return (
    <section 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="education-heading"
    >
      <div className="education-bg-blur-1" aria-hidden="true" />
      <div className="education-bg-blur-2" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/20 border border-accent-violet/30 text-accent-violet text-sm font-medium mb-4">
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

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 education-layout items-start">
            <div className="lg:col-span-2">
              <div className="gsap-reveal-item glass-card p-6 md:p-8 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-12 md:w-14 h-12 md:h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                    aria-hidden="true"
                  >
                    <GraduationCap className="w-6 md:w-7 h-6 md:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-1 break-words leading-tight">
                      {education.university}
                    </h3>
                    <p className="dark:text-primary-400 text-primary-500 font-medium text-sm md:text-base">
                      {education.degree}
                    </p>
                  </div>
                </div>

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

            <div className="lg:col-span-3">
              <div className="space-y-5 md:space-y-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-accent-emerald" />
                    Licenses & Certifications
                  </h3>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {certifications.length} credentials
                  </span>
                </div>

                <div ref={certsGridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
                  {displayedCerts.map((cert, index) => (
                    <EducationCertCard
                      key={cert.id}
                      cert={cert}
                      index={index}
                      expandedCertSkills={expandedCertSkills}
                      toggleCertSkills={toggleCertSkills}
                      isNew={showAllCerts && index >= 4}
                    />
                  ))}
                </div>

                {hasMoreCerts && (
                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAllCerts(!showAllCerts)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border dark:text-primary-400 text-primary-500 hover:text-primary-500 hover:border-primary-500/40 hover:bg-surface-hover transition-colors duration-150 text-sm font-medium"
                      aria-expanded={showAllCerts}
                      aria-label={showAllCerts ? 'Show fewer certifications' : 'Show more certifications'}
                    >
                      {showAllCerts ? (
                        <>
                          Show Less
                          <ChevronDown className="w-4 h-4 rotate-180 transition-transform" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Show More
                          <ChevronDown className="w-4 h-4 transition-transform" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
