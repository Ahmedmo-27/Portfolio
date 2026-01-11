import { useState } from 'react'
import Users from 'lucide-react/dist/esm/icons/users'
import Star from 'lucide-react/dist/esm/icons/star'
import Heart from 'lucide-react/dist/esm/icons/heart'
import Rocket from 'lucide-react/dist/esm/icons/rocket'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up'
import ViewMoreButton from './ViewMoreButton'
import { useInViewOnce } from '../utils/useInViewOnce'
import VolunteerItem from './VolunteerItem'
import { useEffect } from 'react'

// Real volunteering & leadership roles
const volunteeringExperiences = [
  {
    organization: 'Sprints',
    role: 'Student Ambassador',
    period: 'Nov 2025 – Present',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    description:
      'Representing Sprints on campus, supporting students, and promoting technical programs and initiatives.',
    achievements: [
      'Acted as a liaison between Sprints and university students to promote tech opportunities',
      'Helped students discover relevant learning paths and resources',
      'Supported organization of info sessions and engagement activities',
    ],
    isHighlighted: true,
  },
  {
    organization: 'MSP Tech Club - MIU',
    role: 'Head of Software Development',
    period: 'Sep 2025 – Present',
    icon: Rocket,
    color: 'from-violet-500 to-purple-500',
    description:
      'Leading the software development department and building impactful projects for the MSP Tech Club community.',
    achievements: [
      'Developing the official club website using React, Node.js, and MySQL',
      'Leading a department of 25+ volunteers across frontend, backend, and UI/UX',
      'Creating modern project ideas for members in Python, JavaScript, C++, MySQL, React, and Angular',
      'Mentoring members and reviewing code to ensure clean, maintainable implementations',
    ],
    isHighlighted: true,
  },
  {
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

export default function Volunteering() {
  const { ref, isInView } = useInViewOnce()
  const [showAll, setShowAll] = useState(false)
  const initialDisplayCount = 2
  const displayedExperiences = showAll ? volunteeringExperiences : volunteeringExperiences.slice(0, initialDisplayCount)

  useEffect(() => {
    if (isInView && window.location.hash !== '#education') {
      window.history.replaceState(null, '', '#education')
    }
    }, [isInView])

  return (
    <section 
      id="volunteering" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="volunteering-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden="true" />
              Volunteering Experiences
            </span>
            <h2 id="volunteering-heading" className="section-heading mb-6">
              Community <span className="gradient-text">Involvement</span>
            </h2>
            <p className="section-subheading mx-auto">
              Active participation in student organizations, hackathons, and leadership 
              roles that have shaped my collaborative and management skills.
            </p>
          </div>


          {/* Volunteering Experiences */}
          <div className="space-y-6">
            {displayedExperiences.map((exp, index) => (
              <VolunteerItem key={exp.organization} exp={exp} index={index} />
            ))}
          </div>

          {/* View More Button */}
          <div
            className='mt-12 text-center flex flex-col items-center gap-4'
          >
            {volunteeringExperiences.length > initialDisplayCount && (
              <ViewMoreButton
                onClick={() => setShowAll(!showAll)}
                text={showAll ? 'Show Less' : 'View More Volunteering'}
                variant="outline"
                icon={showAll ? ChevronUp : undefined}
              />
            )}
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

