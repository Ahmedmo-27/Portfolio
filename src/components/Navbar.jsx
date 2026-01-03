import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visibleLinks, setVisibleLinks] = useState([]) // ids that are revealed
  const headerRef = useRef(null)
  const headerHeightRef = useRef(80)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Observe sections and set active section based on largest intersection ratio
  useEffect(() => {
    const onLocationChange = () => {
      const hash = window.location.hash.slice(1)
      setActiveSection(hash || '')
    }

    const onSectionRevealed = (e) => {
      const id = e?.detail?.id
      if (!id) return
      setVisibleLinks((prev) => (prev.includes(id) ? prev : [...prev, id]))
    }

    const onSectionsNone = () => {
      setVisibleLinks(navLinks.map(l => l.href.replace('#', '')))
    }

    // Initial state: start with no visible links; they'll reveal one-by-one
    setVisibleLinks([])
    onLocationChange()

    window.addEventListener('locationchange', onLocationChange)
    window.addEventListener('hashchange', onLocationChange)
    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('section-revealed', onSectionRevealed)
    window.addEventListener('sections-none', onSectionsNone)

    return () => {
      window.removeEventListener('locationchange', onLocationChange)
      window.removeEventListener('hashchange', onLocationChange)
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('section-revealed', onSectionRevealed)
      window.removeEventListener('sections-none', onSectionsNone)
    }
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const id = href.replace('#','')
    const el = document.getElementById(id)
    if (el) {
      // Defer layout reads to rAF to avoid forcing synchronous reflow
      window.requestAnimationFrame(() => {
        const headerHeight = headerHeightRef.current || (headerRef.current ? headerRef.current.getBoundingClientRect().height : 80)
        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY - headerHeight - 12
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
        window.history.replaceState(null, '', `#${id}`)
        setMobileOpen(false)
      })
    } else {
      // fallback: navigate to home and rely on URL hash
      navigate('/')
    }
  }

  // Cache header height using ResizeObserver to avoid layout reads on every click
  useEffect(() => {
    const node = headerRef.current
    if (!node) return
    const apply = (h) => { headerHeightRef.current = h }
    // Initial capture in rAF
    requestAnimationFrame(() => {
      try { apply(node.getBoundingClientRect().height) } catch (e) {}
    })

    const ro = new ResizeObserver((entries) => {
      for (const ent of entries) {
        const h = ent.contentRect ? ent.contentRect.height : (ent.target && ent.target.getBoundingClientRect && ent.target.getBoundingClientRect().height)
        apply(h)
      }
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,backdrop-filter] duration-200 ${isScrolled ? 'glass py-3' : 'py-5'}`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveSection('') }} className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg transition-transform hover:scale-[1.02]" aria-label="Home">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border/50 transition-[border-color] duration-200 group-hover:border-primary-500/50" aria-hidden="true">
              <img src={'/Geometric AM logo design.webp'} alt="AM Logo" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">Ahmed<span className="text-primary-400">.</span></span>
          </a>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4">
              {visibleLinks.map(id => {
                const link = navLinks.find(l => l.href.replace('#','') === id)
                if (!link) return null
                const isActive = activeSection === id
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2 rounded-md transition-colors font-medium relative group ${
                      isActive ? 'text-primary-400' : 'text-muted hover:text-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-cyan transition-[width] duration-200 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      aria-hidden="true"
                    />
                  </a>
                )
              })}
            </div>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted rounded-lg">
              {mobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3">
            <ul className="space-y-1">
              {visibleLinks.map(id => {
                const link = navLinks.find(l => l.href.replace('#','') === id)
                if (!link) return null
                const isActive = activeSection === id
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`block px-4 py-2 rounded-md font-medium relative group ${isActive ? 'text-primary-400 bg-primary-500/10' : 'text-muted hover:text-foreground'}`}
                    >
                      {link.name}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-cyan transition-[width] duration-200 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}

