import React from 'react'
import { motion } from 'framer-motion'
import { Download, Mail, ExternalLink, Github, Linkedin, Code2 } from 'lucide-react'
import ProfileCard from './ProfileCard'
import CircuitBoard from './CircuitBoard'
import './Hero.css'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circuit Board Pattern */}
        <CircuitBoard />
        
        {/* Tech Grid Overlay */}
        <div className="tech-grid" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 hero-grid-pattern" />
        
    
        {/* Tech-themed decorative elements */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32 border border-primary-500/20 rounded-lg hero-decorative-gradient-1"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-24 h-24 border border-accent-cyan/20 rounded-full hero-decorative-gradient-2"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Status Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted">
                <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                Open to Opportunities
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
              <span className="text-foreground">Ahmed</span>{' '}
              <span className="gradient-text">Mostafa</span>
            </h1>

            {/* Title with typing effect */}
            <div className="mb-6">
              <div className="text-lg sm:text-xl md:text-2xl text-muted font-light tracking-wide font-mono">
                <span className="text-primary-400">&lt;</span>
                <span className="text-primary-400">
                  Software Engineer
                </span>
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
            </div>
            

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
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
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href="https://github.com/ahmedmo-27"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/ahmedmostafa-swe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:ahmedmostafa2004@hotmail.com"
                className="p-3 rounded-xl glass hover:bg-surface-hover text-muted"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <ProfileCard 
              className="w-full max-w-sm" 
              avatarUrl="/Ahmed Mostafa - Software Development Head Avatar.jpg"
              priority={true}
            />
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default React.memo(Hero)

