import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { assetUrl } from '../utils/assetUrl'
import './Navbar.css'

const navLinks = [
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Education', href: '/#education' },
  { name: 'Contact', href: '/#contact' }
]

// Helper function to extract section ID from href
const getSectionId = (href) => {
  const hashMatch = href.match(/#(.+)/)
  return hashMatch ? hashMatch[1] : ''
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  // Update active section from URL hash on mount and route change
  useEffect(() => {
    if (isHomePage) {
      const hash = location.hash.slice(1) // Remove the '#' from hash
      if (hash) {
        // Check if the section exists before setting it
        const element = document.getElementById(hash)
        if (element) {
          setActiveSection(hash)
          // Scroll to section after a brief delay to ensure DOM is ready
          setTimeout(() => {
            const navbar = document.querySelector('header')
            const navbarHeight = navbar ? navbar.getBoundingClientRect().height : (window.innerWidth >= 768 ? 80 : 70)
            const elementRect = element.getBoundingClientRect()
            const elementTop = elementRect.top + window.scrollY
            const offset = navbarHeight + 16
            const targetScrollY = elementTop - offset
            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: 'smooth'
            })
          }, 100)
        }
      } else {
        setActiveSection('')
      }
    } else {
      setActiveSection('')
    }
  }, [location.pathname, location.hash, isHomePage])

  // Handle isScrolled state on all pages - optimized to avoid unnecessary re-renders
  useEffect(() => {
    let ticking = false
    let lastScrolledState = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 50
          // Only update state if it actually changed
          if (shouldBeScrolled !== lastScrolledState) {
            lastScrolledState = shouldBeScrolled
            setIsScrolled(shouldBeScrolled)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section detection using a SINGLE Intersection Observer for better INP
  useEffect(() => {
    if (!isHomePage) return
    
    const sections = navLinks.map(link => getSectionId(link.href))
    let lastUpdate = 0
    let pendingUpdate = null
    const UPDATE_THROTTLE = 200 // Increased throttle for better INP
    
    // Track which sections are currently intersecting
    const intersectingSections = new Map()
    
    // Single observer for all sections - much better performance
    const observer = new IntersectionObserver(
      (entries) => {
        // Update intersection state for each entry
        for (const entry of entries) {
          const sectionId = entry.target.id
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            intersectingSections.set(sectionId, entry.intersectionRatio)
          } else {
            intersectingSections.delete(sectionId)
          }
        }
        
        // Throttle the actual state update
        const now = Date.now()
        if (now - lastUpdate < UPDATE_THROTTLE) {
          // Schedule a deferred update if not already pending
          if (!pendingUpdate) {
            pendingUpdate = setTimeout(() => {
              pendingUpdate = null
              updateActiveSection()
            }, UPDATE_THROTTLE - (now - lastUpdate))
          }
          return
        }
        
        updateActiveSection()
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0.2]
      }
    )
    
    const updateActiveSection = () => {
      lastUpdate = Date.now()
      
      // Find the section with highest intersection ratio
      let topSection = null
      let topRatio = 0
      for (const [sectionId, ratio] of intersectingSections) {
        if (ratio > topRatio) {
          topRatio = ratio
          topSection = sectionId
        }
      }
      
      if (topSection) {
        setActiveSection(prev => {
          if (prev === topSection) return prev // No change
          // Defer history update using idle callback or timeout
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              if (location.hash !== `#${topSection}`) {
                window.history.replaceState(null, '', `#${topSection}`)
              }
            }, { timeout: 500 })
          }
          return topSection
        })
      } else if (window.scrollY < 100) {
        setActiveSection(prev => {
          if (prev === '') return prev
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              if (location.hash) {
                window.history.replaceState(null, '', location.pathname)
              }
            }, { timeout: 500 })
          }
          return ''
        })
      }
    }
    
    // Observe all sections with the single observer
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    }
    
    return () => {
      observer.disconnect()
      if (pendingUpdate) clearTimeout(pendingUpdate)
    }
  }, [isHomePage, location.hash, location.pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('navbar-menu-open')
    } else {
      document.body.classList.remove('navbar-menu-open')
    }
    return () => {
      document.body.classList.remove('navbar-menu-open')
    }
  }, [isMobileMenuOpen])

  // Smooth scroll handler for navigation links
  const handleNavClick = (e, href) => {
    // Extract hash from href (handles both '#section' and '/#section' formats)
    const hashMatch = href.match(/#(.+)/)
    if (hashMatch) {
      e.preventDefault()
      const targetId = hashMatch[1]
      
      // Store mobile menu state before closing
      const wasMobileMenuOpen = isMobileMenuOpen
      
      // Close mobile menu immediately when a link is clicked
      if (wasMobileMenuOpen) {
        setIsMobileMenuOpen(false)
        document.body.classList.remove('navbar-menu-open')
      }
      
      // If not on home page, navigate to home first, then scroll to section
      if (!isHomePage) {
        navigate(`/#${targetId}`)
        return
      }
      
      const targetElement = document.getElementById(targetId)
      if (!targetElement) return
      
      const scrollToTarget = () => {
        // Get the actual navbar height dynamically
        const navbar = document.querySelector('header')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : (window.innerWidth >= 768 ? 80 : 70)

        // Calculate the target scroll position
        const elementRect = targetElement.getBoundingClientRect()
        const elementTop = elementRect.top + window.scrollY
        // Account for navbar height plus a small gap so headings don't sit under the navbar
        const offset = navbarHeight + 16
        const targetScrollY = elementTop - offset

        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        })
        
        // Update URL hash
        window.history.replaceState(null, '', `#${targetId}`)
      }

      // On mobile, wait for menu to close before scrolling (mobile browsers can ignore scrollTo while overflow is hidden)
      if (wasMobileMenuOpen) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(scrollToTarget)
        })
      } else {
        scrollToTarget()
      }
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,backdrop-filter] duration-200 ${
        isScrolled || isMobileMenuOpen ? 'glass py-3' : 'py-5'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setActiveSection('')
            }}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg transition-transform hover:scale-[1.02]"
            aria-label="Ahmed Mostafa - Home"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-[border-color] duration-200 bg-surface border border-border/50 group-hover:border-primary-500/50"
              aria-hidden="true"
            >
              <img 
                src={assetUrl('/Assets/Geometric AM logo design.png')}
                alt="AM Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-display font-bold text-foreground group-hover:text-primary-400 transition-colors">
              Ahmed<span className="text-primary-400 animate-pulse-glow">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 font-medium transition-colors relative group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  activeSection === getSectionId(link.href) 
                    ? 'text-primary-400' 
                    : 'text-muted hover:text-foreground'
                }`}
                role="menuitem"
                aria-current={activeSection === getSectionId(link.href) ? 'page' : undefined}
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-cyan transition-[width] duration-200 ${
                    activeSection === getSectionId(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </a>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="ml-2 btn-primary text-sm"
            >
              Let's Connect
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted hover:text-foreground transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden overflow-hidden animate-mobile-menu-open"
            role="menu"
          >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block px-4 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      activeSection === getSectionId(link.href)
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-muted hover:text-foreground hover:bg-surface'
                    }`}
                    role="menuitem"
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="block mt-4 btn-primary text-center"
                  role="menuitem"
                >
                  Let's Connect
                </a>
              </div>
          </div>
        )}
      </nav>
    </header>
  )
}

