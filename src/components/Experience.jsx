import {useMemo } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Code from 'lucide-react/dist/esm/icons/code'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import Server from 'lucide-react/dist/esm/icons/server'
import { useInViewOnce } from '../utils/useInViewOnce'
import ExperienceItem from './ExperienceItem'

const experiences = [
  {
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

export default function Experience() {
  const { ref } = useInViewOnce()

  // URL hash updates are handled centrally by the Navbar observer

  const displayedExperiences = useMemo(() => {
    return experiences
  }, [])

  return (
    <section 
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

