import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Building2, Award, Code, Globe, Shield, Gem, Calendar, MapPin, Cpu, ChevronUp, ChevronRight } from 'lucide-react'
import { fadeInLeft, staggerContainerSlow } from '../utils/animations'
import ViewMoreButton from './ViewMoreButton'

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
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Firebase'],
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
  }]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showAll, setShowAll] = useState(false)
  const initialDisplayCount = 4
  const displayedExperiences = showAll ? experiences : experiences.slice(0, initialDisplayCount)

  return (
    <section 
      id="experience" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInLeft} className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" aria-hidden="true" />
              Experience
            </span>
            <h2 id="experience-heading" className="section-heading mb-6">
              Professional <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subheading mx-auto">
              A track record of impactful contributions across internships, 
              freelance projects, and academic achievements.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative" role="list" aria-label="Work experience timeline">
            {/* Timeline Line */}
            <div 
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-cyan to-accent-emerald transform md:-translate-x-1/2" 
              aria-hidden="true" 
            />

            {/* Experience Items */}
            <div className="space-y-8 md:space-y-12">
              {displayedExperiences.map((exp, index) => (
                <motion.article
                  key={exp.company}
                  variants={fadeInLeft}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                  role="listitem"
                  aria-labelledby={`exp-title-${index}`}
                >
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-4 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-card border-2 border-primary-500 transform -translate-x-1/2 z-10" 
                    aria-hidden="true" 
                  />

                  {/* Content Card */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 lg:pr-12' : 'md:pl-8 lg:pl-12'} pl-10 md:pl-0`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      whileFocus={{ y: -5 }}
                      className="glass-card p-4 sm:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      tabIndex={0}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        <div 
                          className={`w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          aria-hidden="true"
                        >
                          <exp.icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            id={`exp-title-${index}`}
                            className="text-base sm:text-lg md:text-xl font-display font-semibold text-foreground mb-1 leading-tight"
                          >
                            {exp.company}
                          </h3>
                          <p className="text-primary-400 font-medium text-xs sm:text-sm">
                            {exp.role}
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 md:gap-4 mb-3 md:mb-4 text-xs sm:text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4 text-primary-400" aria-hidden="true" />
                          <time>{exp.period}</time>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4 text-accent-cyan" aria-hidden="true" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-1.5 md:space-y-2 mb-3 md:mb-4" role="list">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 md:mt-2 flex-shrink-0" aria-hidden="true" />
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
                        {exp.tags.map((tag) => (
                          <span key={tag} className="tech-tag text-[10px] sm:text-xs" role="listitem">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" aria-hidden="true" />
                </motion.article>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <motion.div
            variants={fadeInLeft}
            className="mt-12 text-center"
          >
            {experiences.length > initialDisplayCount && (
              <ViewMoreButton
                onClick={() => setShowAll(!showAll)}
                text={showAll ? 'Show Less' : 'View More Experience'}
                variant="outline"
                icon={showAll ? ChevronUp : ChevronRight}
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

