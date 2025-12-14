import { motion } from 'framer-motion'
import { ChevronRight, ExternalLink, ArrowRight } from 'lucide-react'

export default function ViewMoreButton({ 
  onClick, 
  href, 
  text = 'View More', 
  variant = 'default',
  className = '',
  icon: CustomIcon = ChevronRight 
}) {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
  
  const variants = {
    default: "bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover",
    primary: "bg-gradient-to-r from-primary-500 to-accent-cyan text-white hover:shadow-lg hover:shadow-primary-500/25",
    outline: "border-2 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500",
    ghost: "text-muted hover:text-foreground hover:bg-surface"
  }

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClasses}
      >
        <span>{text}</span>
        <CustomIcon className="w-4 h-4" />
      </motion.a>
    )
  }

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className={buttonClasses}
    >
      <span>{text}</span>
      <CustomIcon className="w-4 h-4" />
    </motion.button>
  )
}

