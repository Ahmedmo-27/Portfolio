import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Menu from 'lucide-react/dist/esm/icons/menu'
import X from 'lucide-react/dist/esm/icons/x'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'
import { observe } from '../utils/sharedObserver'

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
  const [visibleLinks, setVisibleLinks] = useState(['About']) // Initially only About
  const [linksStartedLoading, setLinksStartedLoading] = useState(false)
  const visibleLinksRef = useRef(visibleLinks)
  useEffect(() => {
    visibleLinksRef.current = visibleLinks
  }, [visibleLinks])

  // Queue-based stagger refs
  const revealQueueRef = useRef([])
  const revealTimerRef = useRef(null)
  const REVEAL_INTERVAL = 100
  // Header (navbar) size cache to avoid repetitive getBoundingClientRect reads
  const navbarRef = useRef(null)
  const navbarRectRef = useRef(null)
  
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

  useEffect(() => {
    if (!isHomePage) return
    const sections = navLinks.map(link => getSectionId(link.href))
    // Map id -> { ratio, rect } where rect is the last IntersectionObserverEntry.boundingClientRect
    const intersectingSections = new Map()
    let isHeroInView = false

    const cleanupMap = new Map()
    let rafId = null

    const scheduleProcess = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null

        // Determine top section for highlighting

        const heroInView = isHeroInView
        // Snapshot the intersecting sections map (stores rects from IntersectionObserver entries)
        const intersectingSectionsSnapshot = new Map(intersectingSections)

        let topSection = null
        let topScore = 0
        const navbarHeight = navbarRectRef.current ? navbarRectRef.current.height : 100

        if (intersectingSectionsSnapshot.size > 0) {
          intersectingSectionsSnapshot.forEach(({ ratio, rect }, id) => {
            if (!rect) return
            const topOffset = Math.max(0, rect.top - navbarHeight)
            const score = ratio * (1 - Math.min(topOffset / window.innerHeight, 0.5))
            if (score > topScore) {
              topScore = score
              topSection = id
            }
          })
        }

        if (heroInView) {
          setActiveSection('')
          if (location.hash) {
            window.history.replaceState(null, '', location.pathname)
          }
        } else if (topSection) {
          setActiveSection(topSection)
          if (window.location.hash !== `#${topSection}`) {
            window.history.replaceState(null, '', `#${topSection}`)
          }
        } else if (window.scrollY < 100) {
          setActiveSection('')
          if (location.hash) {
            window.history.replaceState(null, '', location.pathname)
          }
        }
      })
    }

    const handleEntry = (entry) => {
      const id = entry.target.id

      if (id === 'hero') {
        isHeroInView = entry.isIntersecting && entry.intersectionRatio > 0.5
      }

      if (sections.includes(id)) {
        if (entry.isIntersecting) {
          // Store intersection ratio and the boundingClientRect provided by the entry
          intersectingSections.set(id, { ratio: entry.intersectionRatio, rect: entry.boundingClientRect })

          const alreadyVisible = visibleLinksRef.current.includes(id)
          const alreadyQueued = revealQueueRef.current.includes(id)
          if (!alreadyVisible && !alreadyQueued) {
            setLinksStartedLoading(true)
            revealQueueRef.current.push(id)

            if (!revealTimerRef.current) {
              revealTimerRef.current = setInterval(() => {
                const next = revealQueueRef.current.shift()
                if (next) {
                  setVisibleLinks((prev) => [...prev, next])
                }
                if (revealQueueRef.current.length === 0) {
                  clearInterval(revealTimerRef.current)
                  revealTimerRef.current = null
                }
              }, REVEAL_INTERVAL)
            }
          }
        } else {
          intersectingSections.delete(id)
        }
      }

      scheduleProcess()
    }

    // Observe hero and all sections using shared observer (continuous)
    const heroEl = document.getElementById('hero')
    if (heroEl) {
      const cleanup = observe(heroEl, handleEntry, { rootMargin: '-100px 0px -50% 0px', threshold: [0.1,0.2,0.3,0.4,0.5], once: false })
      cleanupMap.set('hero', cleanup)
    }

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        const cleanup = observe(el, handleEntry, { rootMargin: '-100px 0px -50% 0px', threshold: [0.1,0.2,0.3,0.4,0.5], once: false })
        cleanupMap.set(id, cleanup)
      }
    })

    return () => {
      for (const fn of cleanupMap.values()) {
        try { fn() } catch (e) {}
      }
      cleanupMap.clear()
      if (revealTimerRef.current) {
        clearInterval(revealTimerRef.current)
        revealTimerRef.current = null
      }
      revealQueueRef.current = []
    }
  }, [isHomePage, location.pathname])

  // If not on the home page, links are already available — show button
  useEffect(() => {
    if (!isHomePage) setLinksStartedLoading(true)
  }, [isHomePage])

  // When visibleLinks grows beyond the initial stub, mark links as started
  useEffect(() => {
    if (visibleLinks.length > 1) setLinksStartedLoading(true)
  }, [visibleLinks])

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

  // Cache navbar bounding values using ResizeObserver to avoid repeated layout reads
  useEffect(() => {
    const node = navbarRef.current
    if (!node) return

      // Use ResizeObserver's contentRect to update navbar height without triggering layout reads
      const ro = new ResizeObserver((entries) => {
        if (!entries || !entries.length) return
        const entry = entries[0]
        if (entry.contentRect && entry.contentRect.height) {
          navbarRectRef.current = { height: entry.contentRect.height }
        } else {
          // Fallback: defer a safe read to rAF
          requestAnimationFrame(() => {
            try {
              const r = node.getBoundingClientRect()
              navbarRectRef.current = { height: r.height }
            } catch (e) {}
          })
        }
      })
      ro.observe(node)

    return () => ro.disconnect()
  }, [])

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
          const navbarRect = navbarRectRef.current
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
      ref={navbarRef}
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
                src={'/Geometric AM logo design.webp'}
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
          <div className="hidden md:flex items-center gap-1" aria-label="Primary">
            {navLinks
              .filter((link) => visibleLinks.includes(getSectionId(link.href)))
              .map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-2 font-medium transition-colors relative group rounded-lg opacity-0 animate-fade-in ${
                    activeSection === getSectionId(link.href)
                      ? 'text-primary-400'
                      : 'text-muted hover:text-foreground'
                  }`}
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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {linksStartedLoading && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted hover:text-foreground transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden overflow-hidden animate-mobile-menu-open"
          >
            <ul className="py-4 space-y-1" aria-label="Mobile">
              {navLinks
                .filter((link) => visibleLinks.includes(getSectionId(link.href)))
                .map((link, idx) => (
                  <li key={link.name} className="transition-opacity opacity-0 animate-fade-in">
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`block px-4 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        activeSection === getSectionId(link.href)
                          ? 'text-primary-400 bg-primary-500/10'
                          : 'text-muted hover:text-foreground hover:bg-surface'
                      }`}
                      aria-current={activeSection === getSectionId(link.href) ? 'page' : undefined}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}

