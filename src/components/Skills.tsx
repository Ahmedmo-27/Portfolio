import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Cloud, Database, Layout, Smartphone, TestTube, Wrench, ChevronDown, ChevronUp } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'

// Skill levels: 1 = Beginner, 2 = Intermediate, 3 = Advanced, 4 = Expert
type SkillLevel = 1 | 2 | 3 | 4

interface Skill {
  name: string
  level: SkillLevel
}

const skillLevelLabels: Record<SkillLevel, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
}

const skillLevelColors: Record<SkillLevel, string> = {
  1: 'bg-slate-400',
  2: 'bg-blue-400',
  3: 'bg-emerald-400',
  4: 'bg-amber-400',
}

const skillCategories: {
  title: string
  icon: typeof Cloud
  color: string
  skills: Skill[]
}[] = [
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Docker', level: 3 },
      { name: 'CI/CD', level: 4 },
      { name: 'Azure DevOps', level: 3 },
      { name: 'GitHub Actions', level: 3 },
      { name: 'Bash', level: 4 },
      { name: 'PowerShell', level: 3 },
      { name: 'Linux', level: 4 },
      { name: 'Nginx', level: 3 },
      { name: 'DigitalOcean', level: 3 },
      { name: 'Systemd', level: 3 },
      { name: 'Monitoring', level: 3 },
      { name: 'Logging Pipelines', level: 3 },
      { name: 'Node.js Deployment', level: 4 },
      { name: 'Java Maven Deployment', level: 3 },
      { name: 'VPN & Networking', level: 2 },
    ],
  },
  {
    title: 'Backend & Databases',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Node.js', level: 4 },
      { name: 'Express', level: 4 },
      { name: 'MongoDB', level: 4 },
      { name: 'Mongoose', level: 4 },
      { name: 'PostgreSQL', level: 3 },
      { name: 'MySQL', level: 3 },
      { name: 'REST APIs', level: 4 },
      { name: 'JWT Authentication', level: 4 },
      { name: 'API Design', level: 3 },
    ],
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'React', level: 4 },
      { name: 'Vite', level: 3 },
      { name: 'HTML5', level: 4 },
      { name: 'CSS3', level: 4 },
      { name: 'JavaScript', level: 4 },
      { name: 'TypeScript', level: 3 },
      { name: 'Tailwind CSS', level: 4 },
      { name: 'Angular', level: 2 },
      { name: 'Responsive Design', level: 4 },
    ],
  },
  {
    title: 'Android Development',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Kotlin', level: 4 },
      { name: 'Jetpack Compose', level: 4 },
      { name: 'Retrofit', level: 4 },
      { name: 'OkHttp', level: 3 },
      { name: 'Firebase Auth', level: 3 },
      { name: 'Firestore', level: 3 },
      { name: 'MVVM Architecture', level: 4 },
      { name: 'Material Design 3', level: 4 },
      { name: 'Room Database', level: 3 },
    ],
  },
  {
    title: 'Testing',
    icon: TestTube,
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'Selenium WebDriver', level: 3 },
      { name: 'Postman', level: 4 },
      { name: 'JUnit', level: 3 },
      { name: 'Mockito', level: 2 },
      { name: 'Espresso', level: 3 },
      { name: 'STLC', level: 3 },
      { name: 'Test Case Design', level: 3 },
      { name: 'Bug Reporting', level: 4 },
      { name: 'API Testing', level: 4 },
    ],
  },
  {
    title: 'Other Tools',
    icon: Wrench,
    color: 'from-pink-500 to-rose-500',
    skills: [
      { name: 'Git', level: 4 },
      { name: 'GitHub', level: 4 },
      { name: 'XAMPP', level: 3 },
      { name: 'Three.js', level: 2 },
      { name: 'Stripe Integration', level: 3 },
      { name: 'Twilio', level: 3 },
      { name: 'Firebase', level: 3 },
      { name: 'Heroku', level: 3 },
    ],
  },
]

// Skill level indicator component
function SkillLevelIndicator({ level }: { level: SkillLevel }) {
  return (
    <div 
      className="flex gap-0.5 ml-auto" 
      role="img" 
      aria-label={`Skill level: ${skillLevelLabels[level]}`}
      title={skillLevelLabels[level]}
    >
      {[1, 2, 3, 4].map((dot) => (
        <span
          key={dot}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            dot <= level ? skillLevelColors[level] : 'bg-border'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showLevels, setShowLevels] = useState(true)

  return (
    <section 
      id="skills" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="skills-heading"
    >
      {/* Background Elements */}
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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" aria-hidden="true" />
              Technical Skills
            </span>
            <h2 id="skills-heading" className="section-heading mb-6">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
            <p className="section-subheading mx-auto">
              A comprehensive toolkit spanning DevOps, full-stack development, 
              mobile engineering, and quality assurance.
            </p>
          </motion.div>

          {/* Skill Level Legend & Toggle */}
          <motion.div 
            variants={fadeInUp} 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setShowLevels(!showLevels)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-primary-500/40 text-muted hover:text-foreground transition-all text-sm"
              aria-pressed={showLevels}
            >
              {showLevels ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showLevels ? 'Hide' : 'Show'} Skill Levels
            </button>
            
            {showLevels && (
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Beginner
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Intermediate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Advanced
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Expert
                </span>
              </div>
            )}
          </motion.div>

          {/* Skills Grid */}
          <div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            role="list"
            aria-label="Skill categories"
          >
            {skillCategories.map((category) => (
              <motion.article
                key={category.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                whileFocus={{ y: -5 }}
                className="glass-card p-5 md:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                role="listitem"
                tabIndex={0}
                aria-labelledby={`skill-${category.title.replace(/\s+/g, '-')}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                  <div 
                    className={`w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                    aria-hidden="true"
                  >
                    <category.icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                  </div>
                  <h3 
                    id={`skill-${category.title.replace(/\s+/g, '-')}`}
                    className="text-lg md:text-xl font-display font-semibold text-foreground"
                  >
                    {category.title}
                  </h3>
                </div>

                {/* Skills Tags with Levels */}
                <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label={`${category.title} skills`}>
                  {category.skills.map((skill) => (
                    <span 
                      key={skill.name} 
                      className="tech-tag text-xs md:text-sm inline-flex items-center gap-2"
                      role="listitem"
                    >
                      {skill.name}
                      {showLevels && <SkillLevelIndicator level={skill.level} />}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
