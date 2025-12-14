import { motion } from 'framer-motion'
import { Image, Video, FileText, Upload } from 'lucide-react'

const icons = {
  image: Image,
  video: Video,
  document: FileText,
  all: Upload,
}

export default function MediaPlaceholder({ 
  type = 'all', 
  title,
  description,
  className = '' 
}) {
  const Icon = icons[type]

  const defaultDescriptions = {
    image: 'Insert screenshots here',
    video: 'Insert video demo here',
    document: 'Insert presentation / PDF here',
    all: 'Insert screenshots / video demo / presentation here',
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`media-placeholder group cursor-pointer ${className}`}
    >
      <div className="relative">
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 flex items-center justify-center mb-4 group-hover:from-primary-500/30 group-hover:to-accent-cyan/30 transition-colors">
          <Icon className="w-8 h-8 text-primary-400" />
        </div>

        {/* Multiple icons for 'all' type */}
        {type === 'all' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-6 h-6 rounded-lg bg-surface flex items-center justify-center border border-border">
              <Image className="w-3 h-3 text-muted" />
            </div>
            <div className="w-6 h-6 rounded-lg bg-surface flex items-center justify-center border border-border">
              <Video className="w-3 h-3 text-muted" />
            </div>
            <div className="w-6 h-6 rounded-lg bg-surface flex items-center justify-center border border-border">
              <FileText className="w-3 h-3 text-muted" />
            </div>
          </div>
        )}
      </div>

      {/* Text */}
      <p className="media-placeholder-text mt-2">
        {title || defaultDescriptions[type]}
      </p>
      {description && (
        <p className="media-placeholder-hint">
          {description}
        </p>
      )}
    </motion.div>
  )
}

// Grid of multiple placeholders
export function MediaPlaceholderGrid({ projectName, className = '' }) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="aspect-video rounded-xl bg-surface border-2 border-dashed border-border hover:border-primary-500/50 flex flex-col items-center justify-center p-3 transition-all cursor-pointer group"
      >
        <Image className="w-6 h-6 text-muted group-hover:text-primary-400 transition-colors mb-1" />
        <span className="text-[10px] text-muted text-center">Screenshots</span>
      </motion.div>
      
      <motion.div
        whileHover={{ y: -4 }}
        className="aspect-video rounded-xl bg-surface border-2 border-dashed border-border hover:border-accent-cyan/50 flex flex-col items-center justify-center p-3 transition-all cursor-pointer group"
      >
        <Video className="w-6 h-6 text-muted group-hover:text-accent-cyan transition-colors mb-1" />
        <span className="text-[10px] text-muted text-center">Video Demo</span>
      </motion.div>
      
      <motion.div
        whileHover={{ y: -4 }}
        className="aspect-video rounded-xl bg-surface border-2 border-dashed border-border hover:border-accent-emerald/50 flex flex-col items-center justify-center p-3 transition-all cursor-pointer group"
      >
        <FileText className="w-6 h-6 text-muted group-hover:text-accent-emerald transition-colors mb-1" />
        <span className="text-[10px] text-muted text-center">Presentation</span>
      </motion.div>

      {/* Full width hint */}
      <div className="col-span-3 text-center">
        <p className="text-xs text-muted opacity-60">
          Add media for {projectName}
        </p>
      </div>
    </div>
  )
}

