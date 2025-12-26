import React, { useState, useEffect } from 'react'
import Download from 'lucide-react/dist/esm/icons/download'
import Mail from 'lucide-react/dist/esm/icons/mail'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import Github from 'lucide-react/dist/esm/icons/github'
import Linkedin from 'lucide-react/dist/esm/icons/linkedin'
import Code2 from 'lucide-react/dist/esm/icons/code-2'
import ProfileCard from './ProfileCard'
import { assetUrl } from '../utils/assetUrl'
import SkeletonLoader from './SkeletonLoader'

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => {
      // Use requestIdleCallback to defer the state update until the browser is idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setIsLoading(false);
        }, { timeout: 500 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    // Check if the document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Cleanup the event listener
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (isLoading) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pb-25">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="tech-grid" />
          <div className="absolute inset-0 hero-grid-pattern" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content Skeleton */}
            <div className="text-center lg:text-left order-2 lg:order-1 space-y-6">
              {/* Status Badge Skeleton */}
              <div className="flex justify-center lg:justify-start">
                <SkeletonLoader variant="text" className="h-8 w-40 rounded-full" />
              </div>

              {/* Name Skeleton */}
              <div className="space-y-3">
                <SkeletonLoader variant="text" className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-full max-w-md mx-auto lg:mx-0 rounded-lg" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <SkeletonLoader variant="text" className="h-6 sm:h-7 md:h-8 lg:h-9 w-full max-w-sm mx-auto lg:mx-0 rounded-md" />
                <SkeletonLoader variant="text" className="h-5 sm:h-6 md:h-7 lg:h-8 w-full max-w-xs mx-auto lg:mx-0 rounded-md" />
              </div>

              {/* CTA Buttons Skeleton */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3">
                <SkeletonLoader variant="text" className="h-10 md:h-12 w-32 rounded-lg" />
                <SkeletonLoader variant="text" className="h-10 md:h-12 w-28 rounded-lg" />
                <SkeletonLoader variant="text" className="h-10 md:h-12 w-32 rounded-lg" />
              </div>

              {/* Social Links Skeleton */}
              <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3">
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} variant="avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Right Content - Profile Card Skeleton */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-6 md:mb-0 translate-x-4">
              <SkeletonLoader 
                variant="card" 
                className="w-full max-w-xs sm:max-w-sm h-[500px] sm:h-[500px] md:h-[500px] rounded-3xl"
              />
          </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pb-25">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Tech Grid Overlay */}
        <div className="tech-grid" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 hero-grid-pattern" />
        
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Status Badge */}
            <div className="mb-4 md:mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass text-xs md:text-sm text-muted">
                <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                Open to Opportunities
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-3 md:mb-4">
              <span className="text-foreground">Ahmed</span>{' '}
              <span className="gradient-text">Mostafa</span>
            </h1>

            {/* Title with typing effect */}
            <div className="mb-4 md:mb-6">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted font-light tracking-wide font-mono">
                <span className="text-primary-400">&lt;</span>
                <span className="text-primary-400">
                  Junior Software Engineer
                </span>
                <span className="text-primary-400">/&gt;</span>
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted font-light tracking-wide mt-2">
                <Code2 className="inline w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-primary-400" />
                <span className="text-primary-400">Backend & Full-Stack</span>
                <span className="mx-2 text-border">|</span>
                <span>DevOps Interest</span>
              </p>
            </div>
            

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
              <a href={assetUrl("Ahmed Mostafa's CV.pdf")} download className="btn-primary text-sm md:text-base px-4 py-2 md:px-6 md:py-3" target="_blank">
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                Download CV
              </a>
              <a href="#contact" className="btn-secondary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                Contact Me
              </a>
              <a href="#projects" className="btn-secondary text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                View Projects
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-3">
              <a
                href="https://github.com/ahmedmo-27"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/in/ahmedmostafa-swe"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:ahmedmostafa.swe1@gmail.com"
                className="p-2.5 md:p-3 rounded-xl glass hover:bg-surface-hover text-muted"
                aria-label="Email Ahmed Mostafa"
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-6 md:mb-0">
            <ProfileCard 
              className="w-full max-w-xs sm:max-w-sm" 
            />
          </div>
        </div>

      </div>

      {/* Scroll Indicator with tech theme - CSS animated */}
      {/* Moved outside container to position relative to hero section */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 hero-scroll-indicator z-20">
        <div className="hero-scroll-bounce flex flex-col items-center gap-2 text-muted">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-primary-400">scroll</span>
            <span className="text-border">(</span>
            <span className="text-accent-cyan">↓</span>
            <span className="text-border">)</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(Hero)

