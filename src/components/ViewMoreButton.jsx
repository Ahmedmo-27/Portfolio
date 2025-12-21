import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, ArrowRight } from 'lucide-react'

const ViewMoreButton = (props) => {
  const {
    onClick,
    href,
    to,
    text = 'View More',
    variant = 'default',
    className = '',
    icon: CustomIcon = ChevronRight,
    target
  } = props
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
  
  const variants = {
    default: "bg-surface border border-border text-muted hover:text-foreground hover:border-primary-500/40 hover:bg-surface-hover",
    primary: "bg-gradient-to-r from-primary-500 to-accent-cyan text-white hover:shadow-lg hover:shadow-primary-500/25",
    outline: "border-2 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500",
    ghost: "text-muted hover:text-foreground hover:bg-surface"
  }

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`

  // React Router Link (client-side navigation)
  if (to) {
    return (
      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={to}
          className={buttonClasses}
        >
          <span>{text}</span>
          <CustomIcon className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  // External link
  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={buttonClasses}
      >
        <span>{text}</span>
        <CustomIcon className="w-4 h-4" />
      </motion.a>
    )
  }

  // Button with onClick handler
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

export default React.memo(ViewMoreButton)

