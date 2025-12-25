import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pdf-inline',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || '').split('?')[0].toLowerCase()
          if (pathname.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline')
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url || '').split('?')[0].toLowerCase()
          if (pathname.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline')
          }
          next()
        })
      },
    },
    {
      name: 'defer-css',
      transformIndexHtml(html) {
        // Defer CSS loading to prevent render blocking
        // Use media="print" trick: load CSS as print stylesheet, then switch to all media onload
        // This prevents CSS from blocking the initial render and improves LCP
        return html.replace(
          /<link([^>]*?)\s+rel\s*=\s*["']stylesheet["']([^>]*?)>/gi,
          (match, before, after) => {
            // Skip if already has onload handler or is a font stylesheet (already async)
            if (match.includes('onload') || match.includes('fonts.googleapis.com') || match.includes('fonts.gstatic.com')) {
              return match
            }
            // Skip if it's a preload link (different purpose)
            if (match.match(/rel\s*=\s*["']preload["']/i)) {
              return match
            }
            // Reconstruct the link tag with defer attributes
            // Remove any existing media attribute to avoid conflicts
            const attrs = `${before}${after}`.replace(/\s+media\s*=\s*["'][^"']*["']/gi, '').trim()
            const modified = `<link ${attrs} rel="stylesheet" media="print" onload="this.media='all';this.onload=null">`
            // Add noscript fallback for browsers without JS
            return `${modified}<noscript>${match}</noscript>`
          }
        )
      },
    },
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
        unused: true, // Remove unused code
        dead_code: true, // Remove dead code
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Code splitting for better caching and smaller initial bundle
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into smaller chunks
          if (id.includes('node_modules')) {
            // React core - keep together for better tree-shaking
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react'
            }
            // React Router - separate chunk
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            // Lucide icons - separate chunk for lazy loading
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            // Other vendor libraries
            return 'vendor-other'
          }
          // Split large components into their own chunks
          if (id.includes('/components/ProfileCard')) {
            return 'component-profile'
          }
          if (id.includes('/components/Navbar')) {
            return 'component-navbar'
          }
          if (id.includes('/components/TechDivider')) {
            return 'component-divider'
          }
        },
        // Use content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
      treeshake: {
        moduleSideEffects: false, // Better tree-shaking
        preset: 'recommended',
        propertyReadSideEffects: false,
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Generate source maps for debugging (disable in production if needed)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Reduce main thread work by optimizing module resolution
    modulePreload: {
      polyfill: false, // Disable polyfill for modern browsers
    },
  },
  server: {
    proxy: {
      // Local dev: forward API requests to the Express server (Nodemailer endpoint)
      '/api': 'http://localhost:3000',
    },
  },
})

