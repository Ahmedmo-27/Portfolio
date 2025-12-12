import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Globe, Briefcase, Rocket, Code2, Server, Trophy, FolderGit2, Building, Award } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'

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
  { value: '5+', label: 'Projects', icon: FolderGit2, color: 'text-primary-400' },
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
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
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
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20"
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
                <div className="text-center p-5 md:p-6 rounded-2xl glass-card">
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-surface flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl md:text-3xl font-display font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content - Improved Layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12 md:mb-16">
            {/* Left Column - Bio */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 md:p-8">
                <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </span>
                  Background
                </h3>
                <div className="space-y-4 text-muted leading-relaxed">
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
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Specializations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    <span className="text-muted">
                      <span className="text-accent-cyan font-medium">Backend:</span> Node.js, Express, MongoDB
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-emerald" />
                    <span className="text-muted">
                      <span className="text-accent-emerald font-medium">Mobile:</span> Kotlin, Jetpack Compose
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-violet" />
                    <span className="text-muted">
                      <span className="text-accent-violet font-medium">DevOps:</span> CI/CD, Docker, Azure
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-amber" />
                    <span className="text-muted">
                      <span className="text-accent-amber font-medium">Testing:</span> Selenium, Postman
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="relative glass-card p-6 md:p-8 border-l-4 border-primary-500 overflow-hidden">
                <div className="absolute -top-2 -left-2 text-6xl text-primary-500/10 font-serif" aria-hidden="true">"</div>
                <p className="relative text-foreground font-medium italic text-lg">
                  Driven by building reliable systems, modern applications, and optimized user experiences.
                </p>
              </blockquote>
            </motion.div>

            {/* Right Column - Highlights Grid */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <div 
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
                role="list"
                aria-label="Key highlights"
              >
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.08 + 0.4 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="glass-card p-4 md:p-5 group cursor-default relative overflow-hidden"
                    role="listitem"
                    tabIndex={0}
                  >
                    {/* Gradient background on hover */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      aria-hidden="true"
                    />
                    
                    <div 
                      className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      aria-hidden="true"
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="relative text-foreground font-semibold mb-1 text-sm md:text-base">
                      {item.title}
                    </h3>
                    <p className="relative text-xs text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recognition Banner - Enhanced */}
          <motion.div
            variants={fadeInUp}
            className="relative overflow-hidden"
          >
            <div className="relative rounded-2xl p-6 md:p-8 bg-gradient-to-r from-accent-amber/5 via-primary-500/5 to-accent-emerald/5 border border-accent-amber/20">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent-amber/20 rounded-full blur-3xl" aria-hidden="true" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" aria-hidden="true" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-5">
                {/* Trophy icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-accent-amber to-yellow-500 flex items-center justify-center shadow-lg shadow-accent-amber/25">
                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-dark-900" />
                  </div>
                </div>
                
                {/* Text content */}
                <div className="text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-2">
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
