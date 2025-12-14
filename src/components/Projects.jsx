import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, Github, ChevronRight, Gem, Shield, Smartphone, Globe, Terminal, Image, Video, FileText, Play, Download, ChevronUp } from 'lucide-react'
import { fadeInUp, staggerContainerSlow } from '../utils/animations'
import CircuitBoard from './CircuitBoard'
import ViewMoreButton from './ViewMoreButton'

const projects = [
  {
    id: 'vaultique',
    title: 'Vaultique',
    subtitle: 'E-Commerce Platform',
    description: 'Full-stack luxury watch e-commerce platform with payment integration, 3D configurator, CI/CD pipelines, and comprehensive analytics dashboard.',
    icon: Gem,
    color: 'from-amber-500 to-yellow-500',
    tech: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Three.js', 'Twilio', 'CI/CD'],
    features: [
      'Stripe payment integration',
      '3D watch configurator with Three.js',
      'Internal admin dashboards',
      'Real-time analytics',
      'SMS notifications via Twilio',
    ],
    links: {
      demo: '#',
      github: '#',
    },
    ctas: [
      { label: 'View Demo', icon: Play, href: '#' },
      { label: 'Source Code', icon: Github, href: '#' },
    ],
    award: 'Best Web Project of MIU 2025',
    isHighlighted: true,
    media: {
      screenshots: 'Insert Vaultique screenshots here (homepage, product pages, 3D configurator, admin dashboard)',
      video: 'Insert video demo showing the full user journey and 3D configurator',
      presentation: 'Insert project presentation or architecture diagrams',
    },
  },
  {
    id: 'cybertopia',
    title: 'Cybertopia',
    subtitle: 'Honeypot Platform (Digitopia 2025 Semifinalist)',
    description: 'Automated SSH honeypot system capturing 500K+ attack logs with OSINT enrichment and API exposure. Built for cybersecurity research and threat intelligence.',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    tech: ['Python', 'Cowrie', 'PostgreSQL', 'Node.js', 'DigitalOcean', 'OSINT APIs'],
    features: [
      'Cowrie SSH honeypot on DigitalOcean',
      '500K+ SSH attack logs captured',
      '300+ unique attackers identified',
      'OSINT API integration for threat intel',
      '3 REST APIs for data exposure',
    ],
    links: {
      demo: '#',
      github: '#',
    },
    ctas: [
      { label: 'View Project', icon: ExternalLink, href: '#' },
      { label: 'Documentation', icon: FileText, href: '#' },
    ],
    award: 'DIGITOPIA 2025 Semifinalist',
    isHighlighted: true,
    media: {
      screenshots: 'Insert Cybertopia dashboard, attack visualization, and log analysis screenshots',
      video: 'Insert demo video showing real-time attack monitoring',
      presentation: 'Insert architecture diagram and competition presentation',
    },
  },
  {
    id: 'cinemeteor',
    title: 'Cinemeteor',
    subtitle: 'Android App (DEPI Capstone)',
    description: 'Jetpack Compose movie explorer application with TMDB API integration, featuring caching, reviews, similar movies, and smooth loading UX.',
    icon: Smartphone,
    color: 'from-green-500 to-emerald-500',
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Retrofit', 'Room', 'MVVM'],
    features: [
      'TMDB API integration',
      'Offline caching with Room',
      'Firebase Auth & Firestore',
      'Material Design 3 UI',
      'Movie reviews & similar movies',
    ],
    links: {
      demo: 'https://cinemeteor-5a5e0cee6735.herokuapp.com',
      github: '#',
    },
    ctas: [
      { label: 'Live Demo', icon: Play, href: 'https://cinemeteor-5a5e0cee6735.herokuapp.com' },
      { label: 'Download APK', icon: Download, href: '#' },
    ],
    award: 'DEPI Achiever Level Certificate',
    media: {
      screenshots: 'Insert Android app screenshots (home, movie details, search, favorites)',
      video: 'Insert app walkthrough video or screen recording',
      presentation: 'Insert app store graphics or feature breakdown slides',
    },
  },
  {
    id: 'msp-miu',
    title: 'MSP-MIU Website',
    subtitle: 'Student Organization Portal',
    description: 'Official website for Microsoft Student Partners at MIU. Built with Node.js backend and MySQL database, deployed on DigitalOcean and Heroku.',
    icon: Globe,
    color: 'from-violet-500 to-purple-500',
    tech: ['Node.js', 'Express', 'MySQL', 'DigitalOcean', 'Heroku', 'Git'],
    features: [
      'Full-stack web application',
      'MySQL database on DigitalOcean',
      'Heroku deployment',
      'Git workflow with test/production branches',
      'Responsive design',
    ],
    links: {
      demo: 'https://msp-miu.tech',
      github: '#',
    },
    ctas: [
      { label: 'Visit Site', icon: ExternalLink, href: 'https://msp-miu.tech' },
      { label: 'View Code', icon: Github, href: '#' },
    ],
    media: {
      screenshots: 'Insert msp-miu.tech homepage, events page, and team page screenshots',
      video: 'Insert website tour video',
      presentation: 'Insert site architecture or feature overview',
    },
  },
  {
    id: 'devops-tooling',
    title: 'NBE DevOps Scripts',
    subtitle: 'Automation Toolkit',
    description: 'Comprehensive automation toolkit for DevOps operations including disk automation, clean-up scripts, backup utilities, and Azure deployment pipelines.',
    icon: Terminal,
    color: 'from-blue-500 to-cyan-500',
    tech: ['Bash', 'PowerShell', 'Azure DevOps', 'CI/CD', 'Linux'],
    features: [
      'Disk automation scripts',
      'System clean-up utilities',
      'Automated backup solutions',
      'Azure DevOps pipelines',
      'Production deployment automation',
    ],
    links: {
      github: '#',
    },
    ctas: [
      { label: 'View Scripts', icon: Github, href: '#' },
      { label: 'Documentation', icon: FileText, href: '#' },
    ],
    media: {
      screenshots: 'Insert terminal screenshots showing script execution and output',
      video: 'Insert demo of automation pipeline in action',
      presentation: 'Insert pipeline architecture diagrams and documentation screenshots',
    },
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeProject, setActiveProject] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const initialDisplayCount = 2
  const displayedProjects = showAll ? projects : projects.slice(0, initialDisplayCount)

  return (
    <section 
      id="projects" 
      className="py-20 md:py-50 relative overflow-hidden"
      aria-labelledby="projects-heading"
    >
      {/* Background */}
      <CircuitBoard className="opacity-15" />
      <div className="tech-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={staggerContainerSlow}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" aria-hidden="true" />
              Projects
            </span>
            <h2 id="projects-heading" className="section-heading mb-6">
              Featured <span className="gradient-text">Work</span>
            </h2>
            <p className="section-subheading mx-auto">
              A showcase of production-ready applications, award-winning projects, 
              and innovative solutions across various domains.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="space-y-8" role="list" aria-label="Project list">
            {displayedProjects.map((project, index) => (
              <motion.article
                key={project.id}
                variants={fadeInUp}
                role="listitem"
                aria-labelledby={`project-title-${project.id}`}
                className={project.isHighlighted ? 'relative' : ''}
              >
                {/* Highlighted badge for achievements */}
                {project.isHighlighted && (
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-amber text-dark-900 text-xs font-bold shadow-lg">
                      ⭐ Featured Project
                    </span>
                  </div>
                )}

                <motion.div
                  whileHover={{ y: -5 }}
                  whileFocus={{ y: -5 }}
                  className={`glass-card overflow-hidden group ${project.isHighlighted ? 'ring-2 ring-accent-amber/30' : ''}`}
                  tabIndex={0}
                  role="article"
                >
                  <div className={`grid ${index === 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-2'} gap-0`}>
                    {/* Media Section */}
                    <div className={`${index === 0 ? 'lg:col-span-3' : ''} relative bg-surface/50 p-4 sm:p-6`}>
                      {/* Main Placeholder Area */}
                      <div 
                        className="aspect-video rounded-xl bg-surface border-2 border-dashed border-border overflow-hidden relative group/media hover:border-primary-500/50 focus-within:border-primary-500/50 transition-colors"
                        role="img"
                        aria-label={`${project.title} project preview - ${project.media.screenshots}`}
                      >
                        {/* Background Icon */}
                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                          <div className={`w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${project.color} opacity-20 flex items-center justify-center`}>
                            <project.icon className="w-8 sm:w-12 h-8 sm:h-12 text-foreground opacity-50" />
                          </div>
                        </div>
                        
                        {/* Hover Overlay with instructions */}
                        <div className="absolute inset-0 bg-card/95 flex flex-col items-center justify-center opacity-0 group-hover/media:opacity-100 focus-within:opacity-100 transition-opacity duration-300 p-4">
                          <p className="text-foreground font-medium text-center mb-3 text-sm sm:text-base">
                            {project.media.screenshots}
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-2 py-1 rounded-lg bg-primary-500/20 text-primary-400 text-xs">PNG/JPG</span>
                            <span className="px-2 py-1 rounded-lg bg-accent-cyan/20 text-accent-cyan text-xs">GIF</span>
                            <span className="px-2 py-1 rounded-lg bg-accent-emerald/20 text-accent-emerald text-xs">MP4</span>
                          </div>
                        </div>

                        {/* Award Badge */}
                        {project.award && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/20 border border-accent-amber/30 text-accent-amber text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
                              🏆 <span className="hidden sm:inline">{project.award}</span>
                              <span className="sm:hidden">Award</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Media Type Placeholders */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3">
                        <button
                          className="rounded-lg bg-surface border border-border hover:border-primary-500/40 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2 transition-colors group/item"
                          aria-label={`Add screenshots for ${project.title}`}
                        >
                          <Image className="w-4 sm:w-5 h-4 sm:h-5 text-muted group-hover/item:text-primary-400 transition-colors" aria-hidden="true" />
                          <span className="text-[9px] sm:text-[10px] text-muted text-center leading-tight">
                            Screenshots
                          </span>
                        </button>
                        
                        <button
                          className="rounded-lg bg-surface border border-border hover:border-accent-cyan/40 focus-visible:border-accent-cyan focus-visible:ring-2 focus-visible:ring-accent-cyan p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2 transition-colors group/item"
                          aria-label={`Add video demo for ${project.title}`}
                        >
                          <Video className="w-4 sm:w-5 h-4 sm:h-5 text-muted group-hover/item:text-accent-cyan transition-colors" aria-hidden="true" />
                          <span className="text-[9px] sm:text-[10px] text-muted text-center leading-tight">
                            Video Demo
                          </span>
                        </button>
                        
                        <button
                          className="rounded-lg bg-surface border border-border hover:border-accent-emerald/40 focus-visible:border-accent-emerald focus-visible:ring-2 focus-visible:ring-accent-emerald p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2 transition-colors group/item"
                          aria-label={`Add presentation for ${project.title}`}
                        >
                          <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-muted group-hover/item:text-accent-emerald transition-colors" aria-hidden="true" />
                          <span className="text-[9px] sm:text-[10px] text-muted text-center leading-tight">
                            Presentation
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`${index === 0 ? 'lg:col-span-2' : ''} p-4 sm:p-6 flex flex-col`}>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                            <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 id={`project-title-${project.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground truncate">
                              {project.title}
                            </h3>
                            <p className="text-primary-400 text-xs sm:text-sm font-medium truncate">
                              {project.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted text-sm sm:text-base mb-4 flex-grow">
                        {project.description}
                      </p>

                      {/* Features Toggle */}
                      <div className="mb-4">
                        <button
                          onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                          className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                          aria-expanded={activeProject === project.id}
                          aria-controls={`features-${project.id}`}
                        >
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${activeProject === project.id ? 'rotate-90' : ''}`} 
                            aria-hidden="true" 
                          />
                          Key Features
                        </button>
                        {activeProject === project.id && (
                          <motion.ul
                            id={`features-${project.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2 pl-6"
                            role="list"
                          >
                            {project.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" aria-hidden="true" />
                                {feature}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span key={tech} className="tech-tag text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                        {project.ctas.map((cta) => (
                          <a
                            key={cta.label}
                            href={cta.href}
                            target={cta.href.startsWith('http') ? '_blank' : undefined}
                            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="btn-cta"
                          >
                            <cta.icon className="w-4 h-4" aria-hidden="true" />
                            {cta.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </div>

          {/* View More Button */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 text-center flex flex-col items-center gap-4"
          >
            {projects.length > initialDisplayCount && (
              <ViewMoreButton
                onClick={() => setShowAll(!showAll)}
                text={showAll ? 'Show Less' : 'View More Projects'}
                variant="outline"
                icon={showAll ? ChevronUp : undefined}
              />
            )}
            <ViewMoreButton
              href="https://github.com/ahmedmo-27"
              text="View All Projects on GitHub"
              variant="primary"
              icon={Github}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

