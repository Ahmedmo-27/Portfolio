import { lazy, Suspense } from 'react'
import { useInViewOnce } from '../utils/useInViewOnce'
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap'
import Globe from 'lucide-react/dist/esm/icons/globe'
import Rocket from 'lucide-react/dist/esm/icons/rocket'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import Server from 'lucide-react/dist/esm/icons/server'
import FolderGit2 from 'lucide-react/dist/esm/icons/folder-git-2'
import Award from 'lucide-react/dist/esm/icons/award'
import Building2 from 'lucide-react/dist/esm/icons/building-2'
const CircuitBoard = lazy(() => import('./CircuitBoard'))
import StatCard from './StatCard'
import HighlightCard from './HighlightCard'

const highlights = [
  {
    icon: GraduationCap,
    title: 'MIU Student',
    description: 'Software Engineering student (Class of 2027) at Misr International University',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Code2,
    title: 'Backend & Full-Stack',
    description: 'Production MERN and Laravel/MySQL applications',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Server,
    title: 'Team Leadership',
    description: 'Leading 4–5 person engineering teams on award-winning projects',
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
  description: 'Hands-on experience collaborating on production apps from development through deployment.',
  color: 'from-cyan-500 to-blue-500',
}

const stats = [
  { value: '10+', label: 'Full-Stack Applications', icon: FolderGit2, color: 'text-primary-400' },
  { value: '1,000+', label: 'Platform Members Served', icon: Server, color: 'text-accent-emerald', tooltip: 'The Mind Space (TMS) at El Zatuna' },
  { value: '3', label: 'Competition Awards', icon: Award, color: 'text-accent-amber', tooltip: 'Best Web Project MIU 2025 · Top 5 ITIDA Testing Day 2026 · Digitopia 2025 Semifinalist' },
  { value: '5', label: 'Professional Roles', icon: Building2, color: 'text-accent-violet', tooltip: 'El Zatuna, NBE, DEPI, ITIDA, and Fuzetek' },
]

export default function About() {
  const { ref, isInView } = useInViewOnce()

  // URL hash updates are handled centrally by the Navbar observer

  return (
    <section 
      id="about" 
      className="py-16 md:py-28 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <Suspense fallback={null}>
        <CircuitBoard className="opacity-30" />
      </Suspense>
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
              Software Engineering student (Class of 2027) with hands-on experience collaborating on
              production MERN and Laravel/MySQL applications from development through deployment.
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
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 hover:border-primary-500/40 transition-border-color duration-300 shadow-lg">
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
                    I'm a <span className="text-foreground font-semibold">Software Engineering student (Class of 2027)</span> at
                    Misr International University with hands-on experience delivering production
                    <span className="text-primary-400 font-medium"> MERN and Laravel/MySQL</span> applications —
                    including cloud infrastructure, CI/CD automation, and real-time full-stack features.
                  </p>
                  <p>
                    Currently a part-time <span className="text-foreground font-semibold">Full-Stack Developer at El Zatuna</span>,
                    shipping the LMS and The Mind Space platforms, with prior roles at
                    <span className="text-foreground font-semibold"> NBE</span>,
                    <span className="text-foreground font-semibold"> DEPI</span>,
                    <span className="text-foreground font-semibold"> ITIDA</span>, and
                    <span className="text-foreground font-semibold"> Fuzetek</span>. Recognized with
                    <span className="text-foreground font-semibold"> Best Web Project MIU 2025</span>,
                    Top 5 at ITIDA Software Testing Day 2026, and Digitopia 2025 Semifinalist.
                  </p>
                </div>
              </div>

              {/* Tech Specializations */}
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 flex-1 shadow-none">
                {/* Subtle background gradient (very light) */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
                
                <h3 className="relative text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4">
                  Specializations
                </h3>
                <div className="relative grid gap-4 md:gap-9">
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald mt-1.5 flex-shrink-0 shadow-none" />
                    <div className="flex-1">
                      <span className="text-accent-emerald font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-emerald/90 transition-colors">Backend Development</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">MERN & Laravel/MySQL (Node.js, Express, Laravel, MongoDB, PostgreSQL, MySQL, Socket.io)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0 shadow-none" />
                    <div className="flex-1">
                      <span className="text-accent-cyan font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-cyan/90 transition-colors">Frontend Development</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">React, TypeScript, Tailwind CSS, Vite, Capacitor, Next.js</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-violet mt-1.5 flex-shrink-0 shadow-none" />
                    <div className="flex-1">
                      <span className="text-accent-violet font-bold text-sm md:text-base block mb-1 group-hover/item:text-accent-violet/90 transition-colors">DevOps & Cloud Infrastructure</span>
                      <span className="text-muted text-xs md:text-sm leading-relaxed">CI/CD, Docker, GitHub Actions, DigitalOcean, Cloudflare R2/CDN, AWS S3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Highlights Grid (2 columns) */}
            <div 
              className='lg:col-span-2'
            >
              <div className="glass-card p-4 md:p-5 lg:p-6 relative overflow-hidden group border-2 border-primary-500/20 hover:border-primary-500/40 transition-border-color duration-300 h-full flex flex-col shadow-lg">
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