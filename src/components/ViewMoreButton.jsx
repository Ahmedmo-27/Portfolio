import React from 'react'
import { Link } from 'react-router-dom'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'

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
  
  // CSS-based hover/active effects for better INP (no JS on interaction)
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 hover:translate-x-1 active:scale-95"
  
  const variants = {
    default: "bg-surface border border-border text-primary-400 hover:text-primary-300 hover:border-primary-500/40 hover:bg-surface-hover",
    primary: "bg-gradient-to-r from-primary-500 to-accent-cyan text-white hover:shadow-lg hover:shadow-primary-500/25",
    outline: "border-2 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500",
    ghost: "text-muted hover:text-foreground hover:bg-surface"
  }

  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`

  // React Router Link (client-side navigation)
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        <span>{text}</span>
        <CustomIcon className="w-4 h-4" />
      </Link>
    )
  }

  // External link
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={buttonClasses}
      >
        <span>{text}</span>
        <CustomIcon className="w-4 h-4" />
      </a>
    )
  }

  // Button with onClick handler
  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClasses}
    >
      <span>{text}</span>
      <CustomIcon className="w-4 h-4" />
    </button>
  )
}

export default React.memo(ViewMoreButton)

