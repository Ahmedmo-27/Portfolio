import { Heart, Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { assetUrl } from '../utils/assetUrl'

const navLinks = [
  { name: 'About', href: '/#about' },
  { name: 'Experience', href: '/#experience' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Skills', href: '/#skills' },
  { name: 'Education', href: '/#education' },
  { name: 'Contact', href: '/#contact' }
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/ahmedmo-27', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/ahmedmostafa-swe', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:ahmedmostafa.swe1@gmail.com', label: 'Email' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border" role="contentinfo">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Description */}
          <div className="space-y-3 md:space-y-4 sm:col-span-2 md:col-span-1">
            <a 
              href="#" 
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg w-fit"
              aria-label="Ahmed Mostafa - Back to top"
            >
              <div
                className="w-9 md:w-10 h-9 md:h-10 rounded-xl flex items-center justify-center transition-[border-color] duration-200 bg-surface border border-border/60 group-hover:border-primary-500/40"
                aria-hidden="true"
              >
                <img
                  src={assetUrl('/Assets/Geometric AM logo design.png')}
                  alt=""
                  width={28}
                  height={28}
                  className="w-6 md:w-7 h-6 md:h-7 object-contain opacity-90 dark:opacity-100 dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="text-lg md:text-xl font-display font-bold text-foreground group-hover:text-primary-400 transition-colors">
                Ahmed<span className="text-primary-400">.</span>
              </span>
            </a>
            <p className="text-muted text-xs md:text-sm max-w-xs">
              Software Engineer passionate about building modern, scalable applications 
              and cloud-driven solutions.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-start md:justify-center gap-4 md:gap-6" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted hover:text-foreground transition-colors text-xs md:text-sm focus-visible:outline-none focus-visible:text-primary-400"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex justify-start sm:justify-end gap-2 md:gap-3" role="list" aria-label="Social media">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 md:w-10 h-9 md:h-10 rounded-lg bg-surface hover:bg-surface-hover border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={`Visit my ${social.label} profile`}
                role="listitem"
              >
                <social.icon className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted text-xs md:text-sm flex items-center gap-1">
              © {new Date().getFullYear()} Ahmed Mostafa. Built with{' '}
              <Heart className="w-3.5 md:w-4 h-3.5 md:h-4 text-red-500 inline" aria-label="love" /> 
              and React.
            </p>
            
            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-muted hover:text-foreground text-xs md:text-sm transition-[color,transform] duration-150 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:text-primary-400"
              aria-label="Scroll back to top of page"
            >
              Back to top
              <ArrowUp className="w-3.5 md:w-4 h-3.5 md:h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

