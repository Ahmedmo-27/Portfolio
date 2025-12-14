import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Trophy, Star, Target, Heart, Rocket, Calendar, ExternalLink } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'

const volunteeringExperiences = [
  {
    organization: 'Microsoft Student Partners (MSP-MIU)',
    role: 'Software Development Head / Full-Stack Developer',
    period: '2024 – Present',
    icon: Rocket,
    color: 'from-violet-500 to-purple-500',
    description: 'Leading technical initiatives and building web applications for the student community.',
    achievements: [
      'Built and deployed the official msp-miu.tech website',
      'Led a team of developers on multiple projects',
      'Mentored junior members in web development',
      'Organized technical workshops and coding sessions',
    ],
    // TODO: Replace with actual link
    link: 'https://msp-miu.tech',
    isHighlighted: true,
  },
  {
    organization: 'DIGITOPIA 2025',
    role: 'Team Lead - Cybertopia Project',
    period: '2025',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-500',
    description: 'Led a team to develop an innovative cybersecurity honeypot platform.',
    achievements: [
      'Reached competition SEMIFINALS',
      'Managed team coordination and task delegation',
      'Presented project to judges and industry experts',
      'Captured 500K+ SSH attack logs for research',
    ],
    isHighlighted: true,
  },
  {
    organization: 'MIU Tech Community',
    role: 'Active Member & Contributor',
    period: '2023 – Present',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description: 'Contributing to the university tech community through knowledge sharing and peer support.',
    achievements: [
      'Participated in multiple hackathons and coding competitions',
      'Helped peers with programming assignments and projects',
      'Contributed to open-source university projects',
    ],
  },
]

const leadershipHighlights = [
  {
    title: 'Best Web Project Award',
    context: 'MIU 2025',
    icon: Trophy,
    color: 'text-accent-amber',
  },
  {
    title: 'DIGITOPIA Semifinalist',
    context: '2025 Competition',
    icon: Star,
    color: 'text-accent-violet',
  },
  {
    title: 'Top 5% Performance',
    context: 'Among 300+ Interns',
    icon: Target,
    color: 'text-accent-emerald',
  },
  {
    title: 'Dev Team Lead',
    context: 'MSP-MIU',
    icon: Rocket,
    color: 'text-primary-400',
  },
]

export default function Volunteering() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      id="volunteering" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="volunteering-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden="true" />
              Leadership & Volunteering
            </span>
            <h2 id="volunteering-heading" className="section-heading mb-6">
              Community <span className="gradient-text">Involvement</span>
            </h2>
            <p className="section-subheading mx-auto">
              Active participation in student organizations, hackathons, and leadership 
              roles that have shaped my collaborative and management skills.
            </p>
          </motion.div>

          {/* Leadership Highlights Bar */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
          >
            {leadershipHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-4 text-center group"
                tabIndex={0}
              >
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-surface flex items-center justify-center ${highlight.color}`}>
                  <highlight.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-foreground font-semibold text-sm mb-1">
                  {highlight.title}
                </h3>
                <p className="text-muted/60 text-xs">
                  {highlight.context}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Volunteering Experiences */}
          <div className="space-y-6">
            {volunteeringExperiences.map((exp, index) => (
              <motion.article
                key={exp.organization}
                variants={fadeInUp}
                className={exp.isHighlighted ? 'relative' : ''}
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

                <motion.div
                  whileHover={{ y: -5 }}
                  whileFocus={{ y: -5 }}
                  className={`glass-card p-5 md:p-6 group ${exp.isHighlighted ? 'ring-1 ring-accent-emerald/20' : ''}`}
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
                        <span className="inline-flex items-center gap-1.5 text-muted/60 text-sm flex-shrink-0">
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
                </motion.div>
              </motion.article>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 text-center"
          >
            <p className="text-muted text-sm md:text-base mb-4">
              Interested in collaborating or learning more about my community involvement?
            </p>
            <a
              href="#contact"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" aria-hidden="true" />
              Let's Connect
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

