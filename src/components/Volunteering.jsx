import { useState } from 'react'
import Users from 'lucide-react/dist/esm/icons/users'
import Star from 'lucide-react/dist/esm/icons/star'
import Heart from 'lucide-react/dist/esm/icons/heart'
import Rocket from 'lucide-react/dist/esm/icons/rocket'
import Crown from 'lucide-react/dist/esm/icons/crown'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up'
import ViewMoreButton from './ViewMoreButton'
import { useInViewOnce } from '../utils/useInViewOnce'
import VolunteerItem from './VolunteerItem'
import { useEffect } from 'react'

// Real volunteering & leadership roles
const volunteeringExperiences = [
  {
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
    isHighlighted: true,
  },
  {
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
    isHighlighted: true,
  },
  {
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
              <VolunteerItem key={`${exp.organization}-${exp.role}`} exp={exp} index={index} />
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

