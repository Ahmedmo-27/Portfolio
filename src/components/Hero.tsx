import { motion } from 'framer-motion'
import { ArrowDown, Download, Mail, ExternalLink, Github, Linkedin } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../utils/animations'
import ProfileCard from './ProfileCard'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--color-muted) 1px, transparent 1px),
                             linear-gradient(90deg, var(--color-muted) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl"
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

            {/* Title */}
            <motion.div variants={fadeInUp} className="mb-6">
              <p className="text-lg sm:text-xl md:text-2xl text-muted font-light tracking-wide">
                <span className="text-primary-400">Software Engineer</span>
                <span className="mx-2 text-border">|</span>
                <span>DevOps & SRE</span>
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-muted font-light tracking-wide mt-1">
                <span>Full-Stack</span>
                <span className="mx-2 text-border">|</span>
                <span>Android Developer</span>
              </p>
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
            <ProfileCard className="w-full max-w-sm" />
          </div>
        </div>

        {/* Scroll Indicator */}
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
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
