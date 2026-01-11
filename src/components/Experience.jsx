import {useMemo } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Code from 'lucide-react/dist/esm/icons/code'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import { useInViewOnce } from '../utils/useInViewOnce'
import ExperienceItem from './ExperienceItem'

const experiences = [
  {
    company: 'National Bank of Egypt (NBE)',
    role: 'Live Environment Support — DevOps & Automation Intern',
    period: 'Jul 2025 – Aug 2025',
    location: 'Giza, Egypt',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    highlights: [
      'Built Bash/PowerShell automation toolkit used by DevOps team',
      'Automated deployment pipelines on Azure DevOps for core banking systems',
      'Worked closely with UAT & production systems',
      'Improved deployment reliability for mission-critical operations',
    ],
    tags: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Automation'],
    documents: [{ label: 'Recommendation Letter (PDF)', href: '/Experience/NBE Letter of Recommendation.pdf' }],
    certificate: [{ label: 'Internship Certificate', href: '/Experience/NBE.jpg' }],
  },
  {
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
  },
  {
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
  {
    company: 'ITIDA Gigs Freelancing Program',
    role: 'Freelance Software Tester',
    period: 'Feb 2025 – May 2025',
    location: 'Remote',
    icon: Code,
    color: 'from-orange-500 to-amber-500',
    highlights: [
      'Worked hands-on with Selenium, automation frameworks',
      'Tested Node.js APIs using Postman',
      'Logged and tracked defects professionally',
      'Gained freelance & personal branding skillset',
    ],
    tags: ['Selenium', 'Postman', 'API Testing', 'Automation', 'QA'],
    documents: [{ label: 'Program Certificate', href: '/Experience/ITIDA + GIGS.jpg' }],
  }
]

export default function Experience() {
  const { ref } = useInViewOnce()

  // URL hash updates are handled centrally by the Navbar observer

  const displayedExperiences = useMemo(() => {
    return experiences
  }, [])

  return (
    <section 
      id="experience" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className= 'text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4" style={{ backgroundColor: 'var(--pill-exp-bg)', color: 'var(--pill-exp-fg)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full" aria-hidden="true" style={{ backgroundColor: 'var(--pill-exp-dot)' }} />
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

          {/* Timeline */}
          <div className="relative" role="list" aria-label="Work experience timeline">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-emerald transform md:-translate-x-1/2" aria-hidden="true" />

            <div className="space-y-8 md:space-y-12">
              {displayedExperiences.map((exp, index) => (
                <ExperienceItem key={exp.company} exp={exp} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

