import { useEffect, lazy, Suspense } from 'react'
// animation delays set via inline styles to avoid runtime writes
import { useInViewOnce } from '../utils/useInViewOnce'
import Cloud from 'lucide-react/dist/esm/icons/cloud'
import Database from 'lucide-react/dist/esm/icons/database'
import Layout from 'lucide-react/dist/esm/icons/layout'
import Smartphone from 'lucide-react/dist/esm/icons/smartphone'
import TestTube from 'lucide-react/dist/esm/icons/test-tube'
import Wrench from 'lucide-react/dist/esm/icons/wrench'
const CircuitBoard = lazy(() => import('./CircuitBoard'))
import './Skills.css'

const skillCategories = [
  {
    title: 'Backend & Databases',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Node.js (Express)'},
      { name: 'Python'},
      { name: 'Flask'},
      { name: 'MongoDB'},
      { name: 'PostgreSQL'},
      { name: 'MySQL'},
      { name: 'REST APIs (JWT/OAuth basics).'},
    ],
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'React'},
      { name: 'JavaScript'},
      { name: 'Vite'},
      { name: 'Tailwind CSS'},
      { name: 'HTML5'},
      { name: 'CSS3'},
      { name: 'Responsive Design'},
    ],
  },
  {
    title: 'DevOps & Cloud',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Docker'},
      { name: 'Azure Pipelines'},
      { name: 'GitHub Actions'},
      { name: 'Bash'},
      { name: 'PowerShell'},
      { name: 'Linux'},
      { name: 'Cloudflare R2'},
      { name: 'DigitalOcean'},
    ],
  },
  {
    title: 'Testing',
    icon: TestTube,
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'Postman'},
      { name: 'API Testing'},
      { name: 'Selenium WebDriver'},
      { name: 'JUnit'},
      { name: 'Mockito'},
    ],
  },
  {
    title: 'Android Development',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Kotlin'},
      { name: 'Android Development'},
      { name: 'Jetpack Compose'},
      { name: 'Firebase'},
      { name: 'Retrofit'},
      { name: 'MVVM'},
      { name: 'XML'},
      { name: 'Material Design'},
    ],
  },
  {
    title: 'Additional Skills',
    icon: Wrench,
    color: 'from-pink-500 to-rose-500',
    skills: [
      { name: 'Pandas'},
      { name: 'NumPy'},
      { name: 'Matplotlib'},
      { name: 'PHP'},
      { name: 'Angular'},
      { name: 'TypeScript'},
      { name: 'Git'},
      { name: 'GitHub'},
      { name: 'Stripe Integration'},
      { name: 'Chart.js'},
      { name: 'Figma'},
    ],
  }
]

// Grouping: first 3 are Core, remaining are Familiar With
const coreCategories = skillCategories.slice(0, 3)
const familiarCategories = skillCategories.slice(3)

export default function Skills() {
  const { ref, isInView } = useInViewOnce()

  // Update URL hash when section comes into view
  useEffect(() => {
    if (isInView && window.location.hash !== '#skills') {
      window.history.replaceState(null, '', '#skills')
    }
  }, [isInView])

  return (
    <section 
      id="skills" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="skills-heading"
    >
      {/* Background Elements */}
      <Suspense fallback={<div aria-hidden="true" />}>
        <CircuitBoard className="opacity-20" />
      </Suspense>
      <div className="tech-grid opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" aria-hidden="true" />
              Technical Skills
            </span>
            <h2 id="skills-heading" className="section-heading mb-6">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
            <p className="section-subheading mx-auto">
              Focused on backend and full-stack development, with DevOps automation experience 
              and a strong foundation in building scalable APIs and web applications.
            </p>
          </div>

          {/* Core Section */}
          <div className="mb-8">
            <div className='text-center mb-6'>
              <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">Core</h3>
            </div>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
              role="list"
              aria-label="Core skill categories"
            >
              {coreCategories.map((category, index) => (
                <article
                  key={category.title}
                  style={{ ['--animation-delay']: `${index * 0.1 + 0.2}s` }}
                  className='glass-card p-5 md:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-500/10 focus-visible:-translate-y-2 relative overflow-hidden skills-category-item'
                  role="listitem"
                  tabIndex={0}
                  aria-labelledby={`skill-${category.title.replace(/\s+/g, '-')}`}
                >
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                    <div 
                      className={`w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}
                      aria-hidden="true"
                    >
                      <category.icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                    </div>
                    <h4 
                      id={`skill-${category.title.replace(/\s+/g, '-')}`}
                      className="text-lg md:text-xl font-display font-semibold text-foreground group-hover:text-primary-400 transition-colors duration-300"
                    >
                      {category.title}
                    </h4>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 md:gap-2 mt-3" role="list" aria-label={`${category.title} skills`}>
                    {category.skills.map((skill) => (
                      <span 
                        key={skill.name} 
                        className="tech-tag text-xs md:text-sm transition-transform duration-150 hover:scale-105"
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

          {/* Familiar With Section */}
          <div>
            <div className='text-center mb-6'>
              <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">Familiar With</h3>
            </div>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
              role="list"
              aria-label="Familiar skill categories"
            >
              {familiarCategories.map((category, index) => (
                <article
                  key={category.title}
                  style={{ ['--animation-delay']: `${index * 0.1 + 0.2}s` }}
                  className='glass-card p-5 md:p-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-500/10 focus-visible:-translate-y-2 relative overflow-hidden skills-category-item'
                  role="listitem"
                  tabIndex={0}
                  aria-labelledby={`skill-${category.title.replace(/\s+/g, '-')}`}
                >
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                    <div 
                      className={`w-10 md:w-12 h-10 md:h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200`}
                      aria-hidden="true"
                    >
                      <category.icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                    </div>
                    <h4 
                      id={`skill-${category.title.replace(/\s+/g, '-')}`}
                      className="text-lg md:text-xl font-display font-semibold text-foreground group-hover:text-primary-400 transition-colors duration-300"
                    >
                      {category.title}
                    </h4>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 md:gap-2 mt-3" role="list" aria-label={`${category.title} skills`}>
                    {category.skills.map((skill) => (
                      <span 
                        key={skill.name} 
                        className="tech-tag text-xs md:text-sm transition-transform duration-150 hover:scale-105"
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
      </div>
    </section>
  )
}

