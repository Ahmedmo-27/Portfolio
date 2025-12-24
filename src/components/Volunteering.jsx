import { useState } from 'react'
import { Users, Trophy, Star, Heart, Rocket, Calendar, ExternalLink, ChevronUp } from 'lucide-react'
import ViewMoreButton from './ViewMoreButton'
import { useInViewOnce } from '../utils/useInViewOnce'
import './Volunteering.css'

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

  return (
    <section 
      id="volunteering" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="volunteering-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-sm font-medium mb-4">
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
              <article
                key={exp.organization}
                ref={(el) => {
                  if (el) el.style.setProperty('--animation-delay', `${index * 0.15 + 0.2}s`)
                }}
                className={`${exp.isHighlighted ? 'relative' : ''} volunteering-experience-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                role="article"
                aria-labelledby={`vol-title-${index}`}
              >
                {/* Highlighted badge */}
                {exp.isHighlighted && (
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs font-bold">
                      <Heart className="w-3 h-3" aria-hidden="true" />
                      Leadership Role
                    </span>
                  </div>
                )}

                <div
                  className={`glass-card p-5 md:p-6 group transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${exp.isHighlighted ? 'ring-1 ring-accent-emerald/20' : ''}`}
                  tabIndex={0}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    {/* Icon */}
                    <div 
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      aria-hidden="true"
                    >
                      <exp.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 
                            id={`vol-title-${index}`}
                            className="text-lg md:text-xl font-display font-bold text-foreground mb-1"
                          >
                            {exp.organization}
                          </h3>
                          <p className="text-primary-400 font-medium text-sm md:text-base">
                            {exp.role}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-muted text-sm flex-shrink-0">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-muted text-sm md:text-base mb-4">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <ul className="space-y-2 mb-4" role="list" aria-label="Key achievements">
                        {exp.achievements.map((achievement, i) => (
                          <li 
                            key={i} 
                            className="flex items-start gap-2 text-muted text-sm"
                          >
                            <Star className="w-3.5 h-3.5 text-accent-amber mt-0.5 flex-shrink-0" aria-hidden="true" />
                            {achievement}
                          </li>
                        ))}
                      </ul>

                      {/* Link */}
                      {exp.link && (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View More Button */}
          <div
            className={`mt-12 text-center flex flex-col items-center gap-4 ${isInView ? 'animate-fade-in-up animate-delay-4' : 'opacity-0'}`}
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

