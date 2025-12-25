import { useState, useEffect, useMemo, useCallback } from 'react'
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
  
  // Check if we're on the home page or projects page (memoized to avoid recalculation)
  const isHomePage = useMemo(() => location.pathname === '/', [location.pathname])
  const isProjectsPage = useMemo(() => location.pathname === '/projects', [location.pathname])
  
  // Helper function to update active section from URL hash
  const updateActiveSectionFromHash = useCallback(() => {
    if (isProjectsPage) {
      // When on AllProjects page, highlight Projects link
      setActiveSection('projects')
    } else if (isHomePage) {
      // Check both React Router's location.hash and window.location.hash
      // window.location.hash is more reliable for replaceState updates
      const hashFromRouter = location.hash.slice(1)
      const hashFromWindow = window.location.hash.slice(1)
      const hash = hashFromWindow || hashFromRouter
      
      if (hash) {
        // Check if the section exists before setting it
        const element = document.getElementById(hash)
        if (element) {
          setActiveSection(hash)
        } else {
          setActiveSection('')
        }
      } else {
        setActiveSection('')
      }
    } else {
      setActiveSection('')
    }
  }, [isHomePage, isProjectsPage, location.hash])

  // Update active section from URL hash on mount and route change
  useEffect(() => {
    updateActiveSectionFromHash()
  }, [location.pathname, location.hash, isHomePage, isProjectsPage])

  // Poll for hash changes to catch updates from components using replaceState
  // (replaceState doesn't trigger hashchange events, so we check periodically)
  useEffect(() => {
    if (!isHomePage) return
    
    let lastHash = window.location.hash
    const checkHashChange = () => {
      const currentHash = window.location.hash
      if (currentHash !== lastHash) {
        lastHash = currentHash
        updateActiveSectionFromHash()
      }
    }
    
    // Check periodically (less frequent to avoid performance issues)
    const intervalId = setInterval(checkHashChange, 300)
    
    // Also listen to hashchange events (for direct hash changes)
    const handleHashChange = () => {
      lastHash = window.location.hash
      updateActiveSectionFromHash()
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [isHomePage, location.pathname, updateActiveSectionFromHash])

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
    
    // Track which sections are currently intersecting with their bounding rects
    const intersectingSections = new Map()
    let isHeroInView = false
    
    // Observer for navigation sections - detects which section is prominently in view
    const observer = new IntersectionObserver(
      (entries) => {
        // Update intersection state for each entry
        for (const entry of entries) {
          const sectionId = entry.target.id
          if (entry.isIntersecting) {
            // Store intersection ratio and bounding rect for better detection
            intersectingSections.set(sectionId, {
              ratio: entry.intersectionRatio,
              boundingRect: entry.boundingClientRect,
              rootBounds: entry.rootBounds
            })
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
        // Use a tighter rootMargin to detect sections that are actually in the viewport
        // Top margin accounts for navbar, bottom margin ensures section is prominently visible
        rootMargin: '-100px 0px -60% 0px',
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5]
      }
    )
    
    // Separate observer for Hero section - to clear highlights when Hero is visible
    const heroObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isHeroInView = entry.isIntersecting && entry.intersectionRatio > 0.5
        }
        updateActiveSection()
      },
      {
        rootMargin: '-100px 0px 0px 0px',
        threshold: [0.5]
      }
    )
    
    const updateActiveSection = () => {
      lastUpdate = Date.now()
      
      // If Hero is prominently in view, clear active section
      if (isHeroInView) {
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
        return
      }
      
      // Check current hash first - if it matches a valid section, prioritize it
      const currentHash = window.location.hash.slice(1)
      const hashSection = currentHash && sections.includes(currentHash) && document.getElementById(currentHash)
      
      // Find the section that is most prominently in view
      // Prioritize sections that are:
      // 1. Higher intersection ratio
      // 2. Closer to the top of the viewport (after navbar offset)
      let topSection = null
      let topScore = 0
      const navbarHeight = 100 // Approximate navbar height with padding
      
      for (const [sectionId, data] of intersectingSections) {
        if (!sections.includes(sectionId)) continue // Skip non-nav sections
        
        const { ratio, boundingRect } = data
        // Calculate how much of the section is visible above the fold
        // Sections closer to the top (after navbar) get higher priority
        const topOffset = Math.max(0, boundingRect.top - navbarHeight)
        const visibilityScore = ratio * (1 - Math.min(topOffset / window.innerHeight, 0.5))
        
        // Prefer sections that are more centered in viewport
        const centerDistance = Math.abs(boundingRect.top + boundingRect.height / 2 - window.innerHeight / 2)
        const centerScore = 1 - Math.min(centerDistance / window.innerHeight, 1)
        
        // Combined score: intersection ratio + visibility + center position
        const score = ratio * 0.5 + visibilityScore * 0.3 + centerScore * 0.2
        
        if (score > topScore) {
          topScore = score
          topSection = sectionId
        }
      }
      
      // If current hash matches a valid section and it's intersecting, use it
      // This ensures components that update the hash are respected
      if (hashSection && intersectingSections.has(currentHash)) {
        topSection = currentHash
      }
      
      if (topSection) {
        setActiveSection(prev => {
          if (prev === topSection) return prev // No change
          // Only update hash if it doesn't match what we're setting
          // This prevents overriding hash changes from components
          if (window.location.hash !== `#${topSection}`) {
            // Defer history update using idle callback or timeout
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => {
                if (window.location.hash !== `#${topSection}`) {
                  window.history.replaceState(null, '', `#${topSection}`)
                }
              }, { timeout: 500 })
            } else {
              // Fallback for browsers without requestIdleCallback
              setTimeout(() => {
                if (window.location.hash !== `#${topSection}`) {
                  window.history.replaceState(null, '', `#${topSection}`)
                }
              }, 100)
            }
          }
          return topSection
        })
      } else if (window.scrollY < 100) {
        // Clear active section when near top of page
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
    
    // Observe Hero section
    const heroElement = document.getElementById('hero')
    if (heroElement) {
      heroObserver.observe(heroElement)
    }
    
    // Observe all navigation sections with the single observer
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    }
    
    return () => {
      observer.disconnect()
      heroObserver.disconnect()
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
        // Batch DOM queries to avoid forced reflows
        // Use requestAnimationFrame to batch all layout reads together
        requestAnimationFrame(() => {
          // Batch all DOM reads together to minimize reflows
          const navbar = document.querySelector('header')
          const navbarRect = navbar ? navbar.getBoundingClientRect() : null
          const elementRect = targetElement.getBoundingClientRect()
          
          // Calculate values from batched reads
          const navbarHeight = navbarRect ? navbarRect.height : (window.innerWidth >= 768 ? 80 : 70)
          const elementTop = elementRect.top + window.scrollY
          const offset = navbarHeight + 16
          const targetScrollY = elementTop - offset

          // Batch write operations in next frame
          requestAnimationFrame(() => {
            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: 'smooth'
            })
            
            // Update URL hash
            window.history.replaceState(null, '', `#${targetId}`)
          })
        })
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
                src={assetUrl('/Assets/Geometric AM logo design.webp')}
                alt="AM Logo" 
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="low"
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

