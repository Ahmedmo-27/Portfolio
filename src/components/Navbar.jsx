import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)

          // Update active section based on scroll position
          const sections = navLinks.map(link => link.href.slice(1))
          const currentSection = sections.find(section => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              return rect.top <= 150 && rect.bottom >= 150
            }
            return false
          })
          if (currentSection) {
            setActiveSection(currentSection)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    // Only handle hash links
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.slice(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        // Get the actual navbar height dynamically
        const navbar = document.querySelector('header')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : (window.innerWidth >= 768 ? 80 : 70)
        
        // Calculate the target scroll position
        // Get element's position relative to document
        const elementRect = targetElement.getBoundingClientRect()
        const elementTop = elementRect.top + window.scrollY
        // Account for navbar height plus some padding
        const offset = navbarHeight - 40
        const targetScrollY = elementTop - offset

        // Scroll smoothly to the target position
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        })
      }
      
      // Close mobile menu if open
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'py-5'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg transition-transform hover:scale-[1.02]"
            aria-label="Ahmed Mostafa - Home"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-surface border border-border/50 group-hover:border-primary-500/50"
              aria-hidden="true"
            >
              <img 
                src="/Geometric AM logo design.png" 
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
                  activeSection === link.href.slice(1) 
                    ? 'text-primary-400' 
                    : 'text-muted hover:text-foreground'
                }`}
                role="menuitem"
                aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-cyan transition-all duration-300 ${
                    activeSection === link.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'
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
                      activeSection === link.href.slice(1)
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
                  Let's Talk
                </a>
              </div>
          </div>
        )}
      </nav>
    </header>
  )
}

