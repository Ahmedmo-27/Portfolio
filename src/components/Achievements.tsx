import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Trophy, Medal, Award, Star, ExternalLink } from 'lucide-react'
import { fadeInScale, staggerContainerSlow } from '../utils/animations'

const achievements = [
  {
    title: 'Best Web Project of 2025',
    organization: 'Misr International University',
    project: 'Vaultique',
    projectLink: '#projects',
    description: 'Recognized for building an exceptional e-commerce platform with 3D configurator, payment integration, and comprehensive analytics.',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    isHighlighted: true,
  },
  {
    title: 'Semifinalist in DIGITOPIA 2025',
    organization: 'Digitopia Competition',
    project: 'Cybertopia',
    projectLink: '#projects',
    description: 'Team reached semifinals with an innovative cybersecurity honeypot system capturing 500K+ SSH attack logs.',
    icon: Medal,
    color: 'from-slate-300 to-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    isHighlighted: true,
  },
  {
    title: 'DEPI Achiever Level Certificate',
    organization: 'Digital Egyptian Pioneers Initiative',
    project: 'Cinemeteor',
    projectLink: '#projects',
    description: 'Awarded for outstanding performance in Android mobile app development program with Kotlin and Jetpack Compose.',
    icon: Award,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    title: 'Top Performer',
    organization: 'Multiple Internships',
    project: 'NBE, DEPI, ITIDA',
    description: 'Consistently recognized as a top performer across internships at National Bank of Egypt, DEPI, and ITIDA programs.',
    icon: Star,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
]

export default function Achievements() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      id="achievements" 
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="achievements-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInScale} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" aria-hidden="true" />
              Achievements
            </span>
            <h2 id="achievements-heading" className="section-heading mb-6">
              Recognition & <span className="gradient-text">Awards</span>
            </h2>
            <p className="section-subheading mx-auto">
              Highlights of accomplishments and recognition received throughout 
              my academic and professional journey.
            </p>
          </motion.div>

          {/* Highlighted Achievements - Featured Cards */}
          <motion.div variants={fadeInScale} className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.filter(a => a.isHighlighted).map((achievement) => (
                <motion.article
                  key={achievement.title}
                  variants={fadeInScale}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileFocus={{ y: -8, scale: 1.02 }}
                  className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 border-2 ${achievement.borderColor} ${achievement.bgColor} group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                  tabIndex={0}
                  aria-labelledby={`achievement-${achievement.title.replace(/\s+/g, '-')}`}
                >
                  {/* Glow effect */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${achievement.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} aria-hidden="true" />
                  
                  {/* Featured badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-amber/30 text-accent-amber text-xs font-bold">
                      ⭐ Featured
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-6 shadow-lg`} aria-hidden="true">
                    <achievement.icon className="w-8 sm:w-10 h-8 sm:h-10 text-dark-900" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 
                      id={`achievement-${achievement.title.replace(/\s+/g, '-')}`}
                      className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2"
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-primary-400 font-medium text-sm mb-1">
                      {achievement.organization}
                    </p>
                    {achievement.projectLink ? (
                      <a 
                        href={achievement.projectLink}
                        className="inline-flex items-center gap-1 text-muted/60 text-sm mb-4 hover:text-primary-400 transition-colors"
                      >
                        Project: {achievement.project}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="text-muted/60 text-sm mb-4">
                        Project: {achievement.project}
                      </p>
                    )}
                    <p className="text-muted text-sm sm:text-base">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Decorative background icon */}
                  <div className="absolute bottom-4 right-4 opacity-10" aria-hidden="true">
                    <achievement.icon className="w-20 sm:w-28 h-20 sm:h-28" />
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          {/* Other Achievements */}
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.filter(a => !a.isHighlighted).map((achievement) => (
              <motion.article
                key={achievement.title}
                variants={fadeInScale}
                whileHover={{ y: -5, scale: 1.01 }}
                whileFocus={{ y: -5, scale: 1.01 }}
                className="relative glass-card p-6 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                tabIndex={0}
                aria-labelledby={`achievement-other-${achievement.title.replace(/\s+/g, '-')}`}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${achievement.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} aria-hidden="true" />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 shadow-lg`} aria-hidden="true">
                  <achievement.icon className="w-7 h-7 text-dark-900" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 
                    id={`achievement-other-${achievement.title.replace(/\s+/g, '-')}`}
                    className="text-lg font-display font-bold text-foreground mb-2"
                  >
                    {achievement.title}
                  </h3>
                  <p className="text-primary-400 font-medium text-sm mb-1">
                    {achievement.organization}
                  </p>
                  {achievement.projectLink ? (
                    <a 
                      href={achievement.projectLink}
                      className="inline-flex items-center gap-1 text-muted/60 text-sm mb-3 hover:text-primary-400 transition-colors"
                    >
                      Project: {achievement.project}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  ) : (
                    <p className="text-muted/60 text-sm mb-3">
                      Project: {achievement.project}
                    </p>
                  )}
                  <p className="text-muted text-sm">
                    {achievement.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-3 right-3 opacity-10" aria-hidden="true">
                  <achievement.icon className="w-16 h-16" />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
