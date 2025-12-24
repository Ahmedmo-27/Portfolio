import { useInViewOnce } from '../utils/useInViewOnce'
import { GraduationCap, Globe, Rocket, Code2, Server, FolderGit2, Award } from 'lucide-react'
import CircuitBoard from './CircuitBoard'
import './About.css'

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
  {
    icon: Rocket,
    title: 'Production Systems',
    description: 'Building real-world applications',
    color: 'from-cyan-500 to-blue-500',
  },
]

const stats = [
  { value: '10+', label: 'Full-Stack Applications', icon: FolderGit2, color: 'text-primary-400' },
  { value: '500K+', label: 'SSH Logs Analyzed', icon: Server, color: 'text-accent-emerald', tooltip: 'Cybersecurity honeypot project (DIGITOPIA 2025)' },
  { value: '2', label: 'Awards', icon: Award, color: 'text-accent-amber' },
]

export default function About() {
  const { ref, isInView } = useInViewOnce()

  return (
    <section 
      id="about" 
      className="py-12 md:py-50 relative overflow-hidden"
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
          <div className={`text-center mb-12 md:mb-16 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" aria-hidden="true" />
              About Me
            </span>
            <h2 id="about-heading" className="section-heading mb-6">
              Building <span className="gradient-text">Modern Solutions</span>
            </h2>
            <p className="section-subheading mx-auto text-balance max-w-3xl">
              A Junior Software Engineer specializing in backend and full-stack development, 
              with hands-on experience building scalable APIs, web applications, and DevOps automation.
            </p>
          </div>

          {/* Stats Row - Enhanced */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 max-w-5xl mx-auto ${isInView ? 'animate-fade-in-up animate-delay-2' : 'opacity-0'}`}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(el) => {
                  if (el) el.style.setProperty('--animation-delay', `${index * 0.1 + 0.3}s`)
                }}
                className={`relative group transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl about-stat-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
              >
                <div className="text-center p-6 md:p-7 rounded-2xl glass-card h-full relative overflow-hidden group-hover:border-primary-500/30 transition-all duration-300" title={stat.tooltip || ''}>
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
                  
                  <div className={`relative w-12 h-12 mx-auto mb-4 rounded-xl bg-surface flex items-center justify-center ${stat.color} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="relative text-3xl md:text-4xl font-display font-bold gradient-text mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="relative text-sm md:text-base text-muted font-medium group-hover:text-foreground/80 transition-colors duration-300">{stat.label}</div>
                  {stat.tooltip && (
                    <div className="relative mt-2 text-xs text-muted-foreground/70 italic">
                      {stat.tooltip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content - Improved Layout */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 mb-12 md:mb-16">
            {/* Left Column - Bio & Specializations */}
            <div className={`space-y-5 md:space-y-6 ${isInView ? 'animate-fade-in-up animate-delay-3' : 'opacity-0'}`}>
              <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-xl md:text-2xl font-display font-bold text-foreground mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </span>
                  Background
                </h3>
                <div className="relative space-y-4 text-muted leading-relaxed text-sm md:text-base">
                  <p>
                    I'm a <span className="text-foreground font-medium">Junior Software Engineering student</span> at 
                    Misr International University, specializing in <span className="text-primary-400">backend and full-stack development</span>. 
                    I'm passionate about building scalable APIs, RESTful services, and modern web applications.
                  </p>
                  <p>
                    Through internships at <span className="text-foreground font-medium">NBE</span>, 
                    <span className="text-foreground font-medium"> DEPI</span>,
                    <span className="text-foreground font-medium"> ITIDA</span>, and
                    <span className="text-foreground font-medium"> Fuzetek</span>, I've developed production-ready 
                    backend services, automated deployment pipelines, and full-stack applications that solve real business problems.
                  </p>
                </div>
              </div>

              {/* Tech Specializations */}
              <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-5">
                  Specializations
                </h3>
                <div className="relative grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                    <div>
                      <span className="text-accent-emerald font-semibold text-sm md:text-base block mb-1 group-hover/item:text-accent-emerald/90 transition-colors">Backend Development</span>
                      <span className="text-muted text-xs md:text-sm">Node.js, Express, Python, Flask, PHP, MongoDB, PostgreSQL, MySQL, REST APIs</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                    <div>
                      <span className="text-accent-cyan font-semibold text-sm md:text-base block mb-1 group-hover/item:text-accent-cyan/90 transition-colors">Frontend Development</span>
                      <span className="text-muted text-xs md:text-sm">React, Angular, JavaScript, TypeScript, Tailwind CSS</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-violet mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                    <div>
                      <span className="text-accent-violet font-semibold text-sm md:text-base block mb-1 group-hover/item:text-accent-violet/90 transition-colors">DevOps & Automation</span>
                      <span className="text-muted text-xs md:text-sm">CI/CD, Docker, GitHub Actions, Bash, Cloudflare R2</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-amber mt-1.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200" />
                    <div>
                      <span className="text-accent-amber font-semibold text-sm md:text-base block mb-1 group-hover/item:text-accent-amber/90 transition-colors">Testing & QA</span>
                      <span className="text-muted text-xs md:text-sm">Postman, API Testing, Selenium, JUnit, Mockito</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Highlights Grid */}
            <div 
              className={`space-y-5 md:space-y-6 ${isInView ? 'animate-fade-in-up animate-delay-3' : 'opacity-0'}`}
            >
              <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-5">
                  Key Highlights
                </h3>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                  role="list"
                  aria-label="Key highlights"
                >
                  {highlights.map((item, index) => (
                    <div
                      key={item.title}
                      ref={(el) => {
                        if (el) el.style.setProperty('--animation-delay', `${index * 0.08 + 0.4}s`)
                      }}
                      className={`glass-card p-4 md:p-5 group cursor-default relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-lg h-full about-highlight-item ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                      role="listitem"
                      tabIndex={0}
                    >
                      {/* Gradient background on hover */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        aria-hidden="true"
                      />
                      
                      {/* Border glow on hover */}
                      <div 
                        className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-500/20 transition-all duration-300"
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}