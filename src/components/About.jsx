import { useEffect } from 'react'
import batchSetProperty from '../utils/batchStyle'
import { useInViewOnce } from '../utils/useInViewOnce'
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap'
import Globe from 'lucide-react/dist/esm/icons/globe'
import Rocket from 'lucide-react/dist/esm/icons/rocket'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import Server from 'lucide-react/dist/esm/icons/server'
import FolderGit2 from 'lucide-react/dist/esm/icons/folder-git-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
import CircuitBoard from './CircuitBoard'
import StatCard from './StatCard'
import HighlightCard from './HighlightCard'

const highlights = [
  {
    icon: GraduationCap,
    title: 'MIU Student',
    description: 'Junior Software Engineering at Misr International University',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Code2,
    title: 'Backend & Full-Stack',
    description: 'REST APIs, Node.js, Python, PHP, Angular, and React',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Server,
    title: 'DevOps Interest',
    description: 'CI/CD, automation, and cloud infrastructure',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Languages',
    description: 'English (C2) • German (A2)',
    color: 'from-amber-500 to-orange-500',
  },
]

const featuredHighlight = {
  icon: Rocket,
  title: 'Production Systems',
  description: 'Building real-world applications that solve business problems. Experience developing scalable, production-ready systems deployed and used by real users.',
  color: 'from-cyan-500 to-blue-500',
}

const stats = [
  { value: '10+', label: 'Full-Stack Applications', icon: FolderGit2, color: 'text-primary-400' },
  { value: '500K+', label: 'SSH Logs Analyzed', icon: Server, color: 'text-accent-emerald', tooltip: 'Cybersecurity honeypot project (DIGITOPIA 2025)' },
  { value: '2', label: 'Awards', icon: Award, color: 'text-accent-amber' },
  { value: '4', label: 'Internships', icon: Building2, color: 'text-accent-violet', tooltip: 'NBE, DEPI, ITIDA, and Fuzetek' },
]

export default function About() {
  const { ref, isInView } = useInViewOnce()

  // Update URL hash when section comes into view
  useEffect(() => {
    if (isInView && window.location.hash !== '#about') {
      window.history.replaceState(null, '', '#about')
    }
  }, [isInView])

  return (
    <section 
      id="about" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <CircuitBoard className="opacity-30" />
      <div className="tech-grid opacity-20" />
      <div className="about-bg-blur-1" aria-hidden="true" />
      <div className="about-bg-blur-2" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref}>
          {/* Section Header */}
          <div className='text-center mb-14 md:mb-20'>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" aria-hidden="true" />
              About Me
            </span>
            <h2 id="about-heading" className="section-heading mb-4 text-3xl md:text-4xl lg:text-5xl">
              Building <span className="gradient-text">Modern Solutions</span>
            </h2>
            <p className="section-subheading mx-auto text-balance max-w-2xl text-sm md:text-base">
              A Junior Software Engineer specializing in backend and full-stack development, 
              with hands-on experience building scalable APIs, web applications, and DevOps automation.
            </p>
          </div>

          {/* Stats Row - Enhanced */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-14 md:mb-18'>
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Main Content - Improved Layout */}
          <div className="grid lg:grid-cols-5 gap-5 lg:gap-6">
            {/* Left Column - Bio & Specializations (3 columns) */}
            <div className='flex flex-col gap-5 lg:col-span-3'>
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 shadow-lg">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </span>
                  Background
                </h3>
                <div className="relative space-y-2.5 md:space-y-3 text-muted leading-relaxed text-sm md:text-base">
                  <p>
                    I'm a <span className="text-foreground font-semibold">Junior Software Engineering student</span> at 
                    Misr International University, specializing in <span className="text-primary-400 font-medium">backend and full-stack development</span>. 
                    I'm passionate about building scalable APIs, RESTful services, and modern web applications.
                  </p>
                  <p>
                    Through internships at <span className="text-foreground font-semibold">NBE</span>, 
                    <span className="text-foreground font-semibold"> DEPI</span>,
                    <span className="text-foreground font-semibold"> ITIDA</span>, and
                    <span className="text-foreground font-semibold"> Fuzetek</span>, I've developed production-ready 
                    backend services, automated deployment pipelines, and full-stack applications that solve real business problems.
                  </p>
                </div>
              </div>

              {/* Tech Specializations */}
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 flex-1 shadow-lg">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4">
                  Specializations
                </h3>
                <div className="relative grid gap-3">
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300 shadow-lg shadow-accent-emerald/50" />
                    <div className="flex-1">
                      <span className="text-accent-emerald font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-emerald/90 transition-colors">Backend Development</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">Node.js, Express, Python, Flask, PHP, MongoDB, PostgreSQL, MySQL, REST APIs</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300 shadow-lg shadow-accent-cyan/50" />
                    <div className="flex-1">
                      <span className="text-accent-cyan font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-cyan/90 transition-colors">Frontend Development</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">React, Angular, JavaScript, TypeScript, Tailwind CSS</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-violet mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300 shadow-lg shadow-accent-violet/50" />
                    <div className="flex-1">
                      <span className="text-accent-violet font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-violet/90 transition-colors">DevOps & Automation</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">CI/CD, Docker, GitHub Actions, Bash, Cloudflare R2</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-amber mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-300 shadow-lg shadow-accent-amber/50" />
                    <div className="flex-1">
                      <span className="text-accent-amber font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-amber/90 transition-colors">Testing & QA</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">Postman, API Testing, Selenium, JUnit, Mockito</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Highlights Grid (2 columns) */}
            <div 
              className='lg:col-span-2'
            >
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 h-full flex flex-col shadow-lg">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4">
                  Key Highlights
                </h3>
                <div 
                  className="grid gap-3 flex-1"
                  role="list"
                  aria-label="Key highlights"
                >
                  {highlights.map((item, index) => (
                    <HighlightCard key={item.title} item={item} index={index} />
                  ))}
                </div>
                <HighlightCard item={featuredHighlight} index={0} featured />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}