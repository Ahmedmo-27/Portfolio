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
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
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
        },
        // Use content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Generate source maps for debugging (disable in production if needed)
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
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

