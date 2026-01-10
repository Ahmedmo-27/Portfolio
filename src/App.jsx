import { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
const Navbar = lazy(() => import(/* webpackChunkName: "navbar" */ './components/Navbar'))
import Hero from './components/Hero'
import SkeletonLoader from './components/SkeletonLoader'
import LazySection from './components/LazySection'
import TechDivider from './components/TechDivider'

// Lazy load components with webpack magic comments for better chunk names
const About = lazy(() => import(/* webpackChunkName: "about" */ './components/About'))
const Skills = lazy(() => import(/* webpackChunkName: "skills" */ './components/Skills'))
const Experience = lazy(() => import(/* webpackChunkName: "experience" */ './components/Experience'))
const Projects = lazy(() => import(/* webpackChunkName: "projects" */ './components/Projects'))
const Education = lazy(() => import(/* webpackChunkName: "education" */ './components/Education'))
const Volunteering = lazy(() => import(/* webpackChunkName: "volunteering" */ './components/Volunteering'))
const Achievements = lazy(() => import(/* webpackChunkName: "achievements" */ './components/Achievements'))
const Contact = lazy(() => import(/* webpackChunkName: "contact" */ './components/Contact'))
const Footer = lazy(() => import(/* webpackChunkName: "footer" */ './components/Footer'))
const AllProjects = lazy(() => import(/* webpackChunkName: "all-projects" */ './pages/AllProjects'))

// Intentionally avoid eager runtime imports that force parsing/execution.
// Prefetching via dynamic `import()` can cause the browser to download AND
// execute code on the main thread. We keep components lazy and let the
// network/browser decide when to fetch them (or use server-side prefetch
// hints if needed) to reduce main-thread parse/compile time.

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
      
      {/* Section dividers with tech theme */}
      <TechDivider />
      
      <LazySection id="about" fallback={<SectionLoader />}>
        <About />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="achievements" fallback={<SectionLoader />}>
        <Achievements />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="experience" fallback={<SectionLoader />}>
        <Experience />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="projects" fallback={<SectionLoader />}>
        <Projects />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="skills" fallback={<SectionLoader />}>
        <Skills />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="education" fallback={<SectionLoader />}>
        <Education />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="volunteering" fallback={<SectionLoader />}>
        <Volunteering />
      </LazySection>
      
      <TechDivider />
      
      <LazySection id="contact" fallback={<SectionLoader />}>
        <Contact />
      </LazySection>
    </>
  );
}

function AppContent() {
  const [shouldLoadFooter, setShouldLoadFooter] = useState(false)

  useEffect(() => {
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
      <div className="min-h-screen">
        <a 
          href="#main-content" 
          className="skip-link"
        >
          Skip to main content
        </a>
        
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

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

