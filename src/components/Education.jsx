import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { GraduationCap, Calendar, Award, BookOpen, ExternalLink, BadgeCheck, ChevronUp } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'
import ViewMoreButton from './ViewMoreButton'

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

const certifications = [
  {
    title: 'DEPI Achiever Level Certificate',
    issuer: 'Digital Egyptian Pioneers Initiative',
    date: '2025',
    description: 'Android Mobile App Development with Kotlin and Jetpack Compose',
    color: 'from-green-500 to-emerald-500',
    link: '#',
    verified: true,
  },
  {
    title: 'DevOps & Automation',
    issuer: 'National Bank of Egypt (NBE)',
    date: '2025',
    description: 'Live Environment Support, CI/CD, Azure DevOps',
    color: 'from-blue-500 to-cyan-500',
    link: '#',
    verified: true,
  },
  {
    title: 'Software Testing',
    issuer: 'ITIDA Gigs Freelancing Program',
    date: '2025',
    description: 'Selenium, API Testing with Postman, Automation Frameworks',
    color: 'from-orange-500 to-amber-500',
    link: '#',
    verified: true,
  },
  {
    title: 'Problem Solving & Development',
    issuer: 'Fuzetek',
    date: '2025',
    description: 'Python, C++, Debugging, Testing - Top 5% among 300+ interns',
    color: 'from-indigo-500 to-violet-500',
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
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showAll, setShowAll] = useState(false)
  const initialDisplayCount = 2
  const displayedCertifications = showAll ? certifications : certifications.slice(0, initialDisplayCount)

  return (
    <section 
      id="education" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="education-heading"
    >
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
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
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Education Card */}
            <motion.div variants={fadeInUp}>
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
                        key={index} 
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
            </motion.div>

            {/* Certifications */}
            <motion.div variants={fadeInUp}>
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-accent-emerald" />
                  Professional Certifications
                </h3>
                
                {displayedCertifications.map((cert, index) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="glass-card p-4 md:p-5 group relative overflow-hidden"
                    tabIndex={0}
                  >
                    {/* Background glow on hover */}
                    <div 
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`}
                      aria-hidden="true"
                    />
                    
                    <div className="relative flex items-start gap-4">
                      <div 
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                        aria-hidden="true"
                      >
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-foreground font-semibold text-sm md:text-base flex items-center gap-2">
                              {cert.title}
                              {cert.verified && (
                                <BadgeCheck className="w-4 h-4 text-accent-emerald flex-shrink-0" aria-label="Verified certification" />
                              )}
                            </h4>
                            <p className="text-primary-400 text-xs md:text-sm font-medium">
                              {cert.issuer}
                            </p>
                          </div>
                          <span className="text-muted/60 text-xs flex-shrink-0">
                            {cert.date}
                          </span>
                        </div>
                        
                        <p className="text-muted text-xs md:text-sm mt-2">
                          {cert.description}
                        </p>
                        
                        {cert.link && cert.link !== '#' && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                          >
                            View Certificate
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* View More Button */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 text-center flex flex-col items-center gap-4"
          >
            {certifications.length > initialDisplayCount && (
              <ViewMoreButton
                onClick={() => setShowAll(!showAll)}
                text={showAll ? 'Show Less Certifications' : 'View More Certifications'}
                variant="outline"
                icon={showAll ? ChevronUp : undefined}
              />
            )}
            <ViewMoreButton
              href="#achievements"
              text="View My Achievements"
              variant="outline"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

