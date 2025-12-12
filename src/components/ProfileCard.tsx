import { motion } from 'framer-motion'
import { MapPin, Mail, Briefcase, ExternalLink } from 'lucide-react'

interface ProfileCardProps {
  className?: string
}

export default function ProfileCard({ className = '' }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        whileHover={{ 
          y: -8,
          rotateY: 5,
          rotateX: -5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full max-w-sm mx-auto"
      >
        {/* Card Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-emerald rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
        
        {/* Main Card */}
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Header Background */}
          <div className="relative h-24 bg-gradient-to-br from-primary-500/20 via-accent-cyan/20 to-accent-emerald/20">
            {/* Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/30 text-accent-emerald text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                Available
              </span>
            </div>
          </div>

          {/* Profile Image Placeholder */}
          <div className="relative -mt-12 px-6">
            <div className="relative w-24 h-24 mx-auto">
              {/* Image Border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan p-[3px]">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  {/* Profile Image - TODO: Replace with your image */}
                  <img 
                    src="/Ahmed Mostafa - Software Development Head.jpg" 
                    alt="Ahmed Mostafa - Software Engineer based in Cairo, Egypt"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  </div>
              </div>
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 border-4 border-card flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pt-4 pb-6 text-center">
            <h3 className="text-xl font-display font-bold text-foreground mb-1">
              Ahmed Mostafa
            </h3>
            <p className="text-primary-400 font-medium text-sm mb-3">
              Software Engineer
            </p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {['DevOps', 'Full-Stack', 'Android', 'SRE'].map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-surface text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Info Items */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Cairo, Egypt</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <Briefcase className="w-4 h-4 text-accent-cyan" />
                <span>MIU</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <Mail className="w-4 h-4 text-accent-emerald" />
                <span className="truncate">ahmedmostafa2004@hotmail.com</span>
              </div>
            </div>

            {/* Action Button */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-cyan text-white font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 group"
            >
              Get in Touch
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

