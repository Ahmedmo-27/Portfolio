import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Disable console.error in production
if (import.meta.env.PROD) {
  console.error = () => {};
}

// Only use StrictMode in development to avoid double-rendering overhead in production
const AppWrapper = import.meta.env.DEV ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
)

ReactDOM.createRoot(document.getElementById('root')).render(AppWrapper)

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

