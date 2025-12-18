import { useEffect, useState, lazy, Suspense } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SkeletonLoader from './components/SkeletonLoader'
import TechDivider from './components/TechDivider'

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
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      <main id="main-content" role="main">
        <Hero />
        
        {/* Section dividers with tech theme */}
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Achievements />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Experience />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Education />
        </Suspense>
        
        <TechDivider />
        <Suspense fallback={<SectionLoader />}>
          <Volunteering />
        </Suspense>
        
        <TechDivider />
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

