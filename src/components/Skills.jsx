import { useState, lazy, Suspense } from 'react'
import Cloud from 'lucide-react/dist/esm/icons/cloud'
import Database from 'lucide-react/dist/esm/icons/database'
import Layout from 'lucide-react/dist/esm/icons/layout'
import Smartphone from 'lucide-react/dist/esm/icons/smartphone'
import TestTube from 'lucide-react/dist/esm/icons/test-tube'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import { useSectionReveal } from '../hooks/useSectionReveal'
const CircuitBoard = lazy(() => import('./CircuitBoard'))
import './Skills.css'

const skillCategories = [
  {
    title: 'Backend & Databases',
    icon: Database,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Laravel' },
      { name: 'REST APIs' },
      { name: 'JWT/OAuth' },
      { name: 'Socket.io' },
      { name: 'MongoDB' },
      { name: 'MySQL' },
      { name: 'PostgreSQL' },
    ],
  },
  {
    title: 'Frontend',
    icon: Layout,
    color: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'React' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'Vite' },
      { name: 'Capacitor' },
      { name: 'Next.js' },
      { name: 'HTML5/CSS3' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Docker' },
      { name: 'GitHub Actions' },
      { name: 'CI/CD' },
      { name: 'DigitalOcean' },
      { name: 'Cloudflare R2/CDN' },
      { name: 'AWS S3' },
      { name: 'Azure DevOps' },
      { name: 'Linux' },
      { name: 'Bash/PowerShell' },
      { name: 'Git' },
    ],
  },
  {
    title: 'Testing',
    icon: TestTube,
    color: 'from-orange-500 to-amber-500',
    skills: [
      { name: 'Jest' },
      { name: 'JUnit' },
      { name: 'Selenium' },
      { name: 'Postman' },
      { name: 'API Testing' },
    ],
  },
  {
    title: 'Languages',
    icon: Code2,
    color: 'from-pink-500 to-rose-500',
    skills: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'PHP' },
      { name: 'Python' },
      { name: 'Java' },
      { name: 'C++' },
      { name: 'SQL' },
      { name: 'Kotlin' },
    ],
  },
  {
    title: 'Mobile & Additional',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Flutter' },
      { name: 'Kotlin' },
      { name: 'Jetpack Compose' },
      { name: 'Firebase' },
      { name: 'Stripe' },
      { name: 'Geidea' },
      { name: 'Three.js' },
    ],
  },
]

const coreCategories = skillCategories.slice(0, 3)
const familiarCategories = skillCategories.slice(3)

function SkillCategoryCard({ category }) {
  return (
    <article
      className="glass-card p-5 md:p-6 group transition-transform transition-shadow duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-500/10 relative overflow-hidden skills-category-item gsap-reveal-item"
      role="listitem"
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
          <span key={skill.name} className="tech-tag text-xs md:text-sm" role="listitem">
            {skill.name}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function Skills() {
  const [showFamiliar, setShowFamiliar] = useState(false)
  const scopeRef = useSectionReveal({
    nestedSelector: '.tech-tag',
    stagger: 0.08,
    nestedStagger: 0.015,
  })

  return (
    <section className="py-16 md:py-28 relative overflow-hidden" aria-labelledby="skills-heading">
      <Suspense fallback={<div aria-hidden="true" />}>
        <CircuitBoard className="opacity-20" />
      </Suspense>
      <div className="tech-grid opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={scopeRef}>
          <div className="gsap-section-header text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" aria-hidden="true" />
              Technical Skills
            </span>
            <h2 id="skills-heading" className="section-heading mb-6">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
            <p className="section-subheading mx-auto">
              Focused on backend and full-stack development across MERN and Laravel stacks, with cloud infrastructure,
              CI/CD automation, and testing experience.
            </p>
          </div>

          <div className="mb-6">
            <div className="text-center mb-6">
              <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">Core</h3>
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              role="list"
              aria-label="Core skill categories"
            >
              {coreCategories.map((category) => (
                <SkillCategoryCard key={category.title} category={category} />
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowFamiliar((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-primary-500 hover:border-primary-500/40 hover:bg-surface-hover transition-colors text-sm font-medium"
              aria-expanded={showFamiliar}
              aria-controls="familiar-skills"
            >
              {showFamiliar ? 'Hide familiar skills' : 'Show familiar skills'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFamiliar ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          </div>

          {showFamiliar && (
            <div id="familiar-skills" className="mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg md:text-xl font-display font-semibold text-foreground">Familiar With</h3>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                role="list"
                aria-label="Familiar skill categories"
              >
                {familiarCategories.map((category) => (
                  <SkillCategoryCard key={category.title} category={category} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
