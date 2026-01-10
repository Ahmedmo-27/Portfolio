import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Wrap the app in StrictMode to catch potential problems early
const AppWrapper = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element with id "root" not found.')
}
ReactDOM.createRoot(rootEl).render(AppWrapper)

// Load helpers after the app mounts so any events they dispatch are received by listeners in React
// Defer loading these utilities to idle time to avoid blocking the main thread during initial load
const loadDeferredHelpers = () => {
  void import('./utils/locationChange').catch(() => {})
  void import('./utils/sectionObserver').catch(() => {})
}

if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  window.requestIdleCallback(loadDeferredHelpers, { timeout: 2000 })
} else {
  setTimeout(loadDeferredHelpers, 1200)
}

// Defer Service Worker registration to avoid blocking main thread
// Use requestIdleCallback for better performance
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const registerSW = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates periodically using requestIdleCallback
        const checkForUpdates = () => {
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              registration.update()
            }, { timeout: 5000 })
          } else {
            setTimeout(() => registration.update(), 5000)
          }
        }
        // Check every hour
        setInterval(checkForUpdates, 60 * 60 * 1000)
      })
      .catch((error) => {
        // Silently fail - don't log in production
        if (import.meta.env.DEV) {
          console.warn('Service Worker registration failed:', error)
        }
      })
  }

  // Register after page load and when browser is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerSW, { timeout: 2000 })
  } else {
    window.addEventListener('load', () => {
      setTimeout(registerSW, 2000)
    })
  }
}

