import { useRef, useState, useEffect } from 'react'
import { Cloud, Database, Layout, Smartphone, TestTube, Wrench } from 'lucide-react'
import CircuitBoard from './CircuitBoard'
import './Skills.css'

const skillCategories = [
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Docker'},
      { name: 'CI/CD'},
      { name: 'Azure DevOps'},
      { name: 'GitHub Actions'},
      { name: 'Bash'},
      { name: 'PowerShell'},
      { name: 'Linux'},
      { name: 'DigitalOcean'},
      { name: 'Systemd'},
      { name: 'Monitoring'},
      { name: 'Logging Pipelines'},
      { name: 'Deployment Pipelines'},
      { name: 'R2 Cloud Storage'},
      { name: 'CDN Management'}
    ],
  },
  {
    title: 'Backend & Databases',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Node.js'},
      { name: 'Express'},
      { name: 'MongoDB'},
      { name: 'Mongoose'},
      { name: 'PostgreSQL'},
      { name: 'MySQL'},
      { name: 'REST APIs'},
      { name: 'JWT Authentication'},
      { name: 'API Design'},
    ],
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'React'},
      { name: 'Vite'},
      { name: 'HTML5'},
      { name: 'CSS3'},
      { name: 'JavaScript'},
      { name: 'TypeScript'},
      { name: 'Tailwind CSS'},
      { name: 'Angular'},
      { name: 'Responsive Design'},
    ],
  },
  {
    title: 'Android Development',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Kotlin'},
      { name: 'Jetpack Compose'},
      { name: 'Retrofit'},
      { name: 'OkHttp'},
      { name: 'Firebase Auth'},
      { name: 'Firestore'},
      { name: 'MVVM Architecture'},
      { name: 'Material Design 3'},
      { name: 'Room Database'},
    ],
  },
  {
    title: 'Testing',
    icon: TestTube,
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'Selenium WebDriver'},
      { name: 'Postman'},
      { name: 'JUnit'},
      { name: 'Mockito'},
      { name: 'Espresso'},
      { name: 'STLC'},
      { name: 'Test Case Design'},
      { name: 'Bug Reporting'},
      { name: 'API Testing'},
    ],
  },
  {
    title: 'Other Tools',
    icon: Wrench,
    color: 'from-pink-500 to-rose-500',
    skills: [
      { name: 'Git'},
      { name: 'GitHub'},
      { name: 'XAMPP'},
      { name: 'Three.js'},
      { name: 'Stripe Integration'},
      { name: 'Twilio'},
      { name: 'Firebase'},
      { name: 'Heroku'}
    ],
  },
]

export default function Skills() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: '-100px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <section 
      id="skills" 
      className="py-12 md:py-50 relative overflow-hidden"
      aria-labelledby="skills-heading"
    >
      {/* Background Elements */}
      <CircuitBoard className="opacity-20" />
      <div className="tech-grid opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className={`text-center mb-12 md:mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
          </div>

          {/* Skills Grid */}
          <div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            role="list"
            aria-label="Skill categories"
          >
            {skillCategories.map((category, index) => (
              <article
                key={category.title}
                ref={(el) => {
                  if (el) el.style.setProperty('--animation-delay', `${index * 0.1 + 0.2}s`)
                }}
                className={`glass-card p-5 md:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 skills-category-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
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

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label={`${category.title} skills`}>
                  {category.skills.map((skill) => (
                    <span 
                      key={skill.name} 
                      className="tech-tag text-xs md:text-sm"
                      role="listitem"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

