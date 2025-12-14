import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail, ExternalLink, Github, Linkedin, Code2, Terminal } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'
import ProfileCard from './ProfileCard'
import CircuitBoard from './CircuitBoard'
import TypingEffect from './TypingEffect'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circuit Board Pattern */}
        <CircuitBoard />
        
        {/* Tech Grid Overlay */}
        <div className="tech-grid" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--color-muted) 1px, transparent 1px),
                             linear-gradient(90deg, var(--color-muted) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Floating Orbs with tech glow */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl"
        />
        
        {/* Tech-themed decorative elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 border border-primary-500/20 rounded-lg"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(14, 165, 233, 0.1) 50%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-24 h-24 border border-accent-cyan/20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Status Badge */}
            <motion.div variants={fadeInUp} className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                Open to Opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4"
            >
              <span className="text-foreground">Ahmed</span>{' '}
              <span className="gradient-text">Mostafa</span>
            </motion.h1>

            {/* Title with typing effect */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="text-lg sm:text-xl md:text-2xl text-muted font-light tracking-wide font-mono">
                <span className="text-primary-400">&lt;</span>
                <TypingEffect 
                  text="Software Engineer" 
                  speed={80}
                  className="text-primary-400"
                />
                <span className="text-primary-400"> /&gt;</span>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl text-muted font-light tracking-wide mt-2">
                <Code2 className="inline w-5 h-5 mr-2 text-primary-400" />
                <span className="text-primary-400">DevOps & SRE</span>
                <span className="mx-2 text-border">|</span>
                <span>Full-Stack</span>
                <span className="mx-2 text-border">|</span>
                <span>Android Developer</span>
              </p>
            </motion.div>
            
            {/* Tech Status Indicator */}
            <motion.div 
              variants={fadeInUp}
              className="mb-6 flex justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary-500/20 text-xs font-mono">
                <Terminal className="w-4 h-4 text-primary-400" />
                <span className="text-muted">Status:</span>
                <span className="text-accent-emerald">ACTIVE</span>
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <a href="/Ahmed Mostafa's CV.pdf" download className="btn-primary">
                <Download className="w-5 h-5" />
                Download CV
              </a>
              <a href="#contact" className="btn-secondary">
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
              <a href="#projects" className="btn-secondary">
                <ExternalLink className="w-5 h-5" />
                View Projects
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center justify-center lg:justify-start gap-3"
            >
              <a
                href="https://github.com/ahmedmo-27"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/ahmedmostafa-swe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:ahmedmostafa2004@hotmail.com"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted hover:text-foreground transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* Right Content - Profile Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <ProfileCard className="w-full max-w-sm" avatarUrl="/Ahmed Mostafa - Software Development Head Avatar.jpg" />
          </div>
        </div>

        {/* Scroll Indicator with tech theme */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted"
          >
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-primary-400">scroll</span>
              <span className="text-border">(</span>
              <span className="text-accent-cyan">↓</span>
              <span className="text-border">)</span>
            </div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-4 h-4 text-primary-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

