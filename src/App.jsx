import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SkeletonLoader from './components/SkeletonLoader'

// Lazy load TechDivider - not critical for LCP, used multiple times
const TechDivider = lazy(() => import('./components/TechDivider'))

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
const AllProjects = lazy(() => import('./pages/AllProjects'))

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

function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Section dividers with tech theme - lazy loaded */}
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <About />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Achievements />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Projects />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Education />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Volunteering />
      </Suspense>
      
      <Suspense fallback={null}>
        <TechDivider />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Contact />
      </Suspense>
    </>
  )
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoadFooter, setShouldLoadFooter] = useState(false)

  useEffect(() => {
    // Defer opacity transition to avoid blocking initial render
    requestAnimationFrame(() => {
      setIsLoaded(true)
    })
    
    // Defer footer loading until after initial render
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        setShouldLoadFooter(true)
      }, { timeout: 2000 })
    } else {
      setTimeout(() => setShouldLoadFooter(true), 2000)
    }
  }, [])

  return (
    <BrowserRouter>
      <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <a 
          href="#main-content" 
          className="skip-link"
        >
          Skip to main content
        </a>
        
        <Navbar />
        
        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={
              <Suspense fallback={<SectionLoader />}>
                <AllProjects />
              </Suspense>
            } />
          </Routes>
        </main>
        
        {shouldLoadFooter && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
      </div>
    </BrowserRouter>
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

