import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Globe, Briefcase, Rocket, Code2, Server, Trophy, FolderGit2, Building, Award } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'
import CircuitBoard from './CircuitBoard'

const highlights = [
  {
    icon: GraduationCap,
    title: 'MIU Student',
    description: 'Junior Software Engineering at Misr International University',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Server,
    title: 'DevOps & Cloud',
    description: 'Automation, CI/CD, and cloud deployments',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Code2,
    title: 'Full-Stack & Android',
    description: 'Web applications to mobile apps',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Languages',
    description: 'English (C2) • German (A2)',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Briefcase,
    title: '4 Internships',
    description: 'NBE, DEPI, ITIDA, Fuzetek',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Rocket,
    title: 'Production Systems',
    description: 'Building real-world applications',
    color: 'from-cyan-500 to-blue-500',
  },
]

const stats = [
  { value: '20+', label: 'Projects', icon: FolderGit2, color: 'text-primary-400' },
  { value: '4', label: 'Internships', icon: Building, color: 'text-accent-cyan' },
  { value: '500K+', label: 'Attack Logs', icon: Server, color: 'text-accent-emerald' },
  { value: '2', label: 'Awards', icon: Award, color: 'text-accent-amber' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      id="about" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <CircuitBoard className="opacity-30" />
      <div className="tech-grid opacity-20" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" aria-hidden="true" />
              About Me
            </span>
            <h2 id="about-heading" className="section-heading mb-6">
              Building <span className="gradient-text">Modern Solutions</span>
            </h2>
            <p className="section-subheading mx-auto text-balance max-w-3xl">
              A passionate Software Engineer specializing in cloud-driven development, 
              DevOps automation, full-stack engineering, and scalable mobile applications.
            </p>
          </motion.div>

          {/* Stats Row - Enhanced */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <div className="text-center p-6 md:p-7 rounded-2xl glass-card h-full">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-surface flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content - Improved Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
            {/* Left Column - Bio & Specializations */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="glass-card p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </span>
                  Background
                </h3>
                <div className="space-y-4 text-muted leading-relaxed text-sm md:text-base">
                  <p>
                    I'm a <span className="text-foreground font-medium">Junior Software Engineering student</span> at 
                    Misr International University with expertise in <span className="text-primary-400">DevOps</span>, 
                    cloud infrastructure, and full-stack development.
                  </p>
                  <p>
                    Through internships at <span className="text-foreground font-medium">NBE</span>, 
                    <span className="text-foreground font-medium"> DEPI</span>,
                    <span className="text-foreground font-medium"> ITIDA</span>, and
                    <span className="text-foreground font-medium"> Fuzetek</span>, I've built production systems 
                    and proven my ability to deliver real-world solutions.
                  </p>
                </div>
              </div>

              {/* Tech Specializations */}
              <div className="glass-card p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-5">
                  Specializations
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-accent-cyan font-semibold text-sm md:text-base block mb-1">Backend</span>
                      <span className="text-muted text-xs md:text-sm">Node.js, Express, MongoDB</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-accent-emerald font-semibold text-sm md:text-base block mb-1">Mobile</span>
                      <span className="text-muted text-xs md:text-sm">Kotlin, Jetpack Compose</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-violet mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-accent-violet font-semibold text-sm md:text-base block mb-1">DevOps</span>
                      <span className="text-muted text-xs md:text-sm">CI/CD, Docker, Azure</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-amber mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-accent-amber font-semibold text-sm md:text-base block mb-1">Testing</span>
                      <span className="text-muted text-xs md:text-sm">Selenium, Postman</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Highlights Grid */}
            <motion.div 
              variants={fadeInUp}
              className="space-y-6"
            >
              <div className="glass-card p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-5">
                  Key Highlights
                </h3>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  role="list"
                  aria-label="Key highlights"
                >
                  {highlights.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.08 + 0.4 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="glass-card p-4 md:p-5 group cursor-default relative overflow-hidden"
                      role="listitem"
                      tabIndex={0}
                    >
                      {/* Gradient background on hover */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        aria-hidden="true"
                      />
                      
                      <div className="flex items-start gap-4">
                        <div 
                          className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          aria-hidden="true"
                        >
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="relative text-foreground font-semibold mb-1.5 text-sm md:text-base">
                            {item.title}
                          </h3>
                          <p className="relative text-xs md:text-sm text-muted leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recognition Banner - Enhanced */}
          <motion.div
            variants={fadeInUp}
            className="relative overflow-hidden mb-12 md:mb-16"
          >
            <div className="relative rounded-2xl p-6 md:p-10 bg-gradient-to-r from-accent-amber/10 via-primary-500/10 to-accent-emerald/10 border border-accent-amber/30 backdrop-blur-sm">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/4 w-40 h-40 bg-accent-amber/20 rounded-full blur-3xl" aria-hidden="true" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" aria-hidden="true" />
              
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Trophy icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-accent-amber to-yellow-500 flex items-center justify-center shadow-lg shadow-accent-amber/30">
                    <Trophy className="w-10 h-10 md:w-12 md:h-12 text-dark-900" />
                  </div>
                </div>
                
                {/* Text content */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                    Top Performer Recognition
                  </h3>
                  <p className="text-muted text-sm md:text-base leading-relaxed">
                    Recognized as a <span className="text-primary-400 font-semibold">top performer</span> across 
                    internships at <span className="text-foreground font-medium">NBE</span>, 
                    <span className="text-foreground font-medium"> DEPI</span>, 
                    <span className="text-foreground font-medium"> ITIDA</span>, and 
                    <span className="text-foreground font-medium"> Fuzetek</span> — ranked in the 
                    <span className="text-accent-emerald font-semibold"> top 5%</span> among 300+ interns.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}