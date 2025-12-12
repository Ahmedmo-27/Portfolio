import { useEffect, useState, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SkeletonLoader from './components/SkeletonLoader'

// Lazy load components for better performance
const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Education = lazy(() => import('./components/Education'))
const Volunteering = lazy(() => import('./components/Volunteering'))
const Achievements = lazy(() => import('./components/Achievements'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

// Loading fallback component for sections
function SectionLoader() {
  return (
    <div className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonLoader variant="section" />
      </div>
    </div>
  )
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      <main id="main-content" role="main">
        <Hero />
        
        {/* Section dividers with proper spacing */}
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Education />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Volunteering />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Achievements />
        </Suspense>
        
        <div className="section-divider" aria-hidden="true" />
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
