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
    // Enable minification with optimized settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Balanced compression
        unused: true,
        dead_code: true,
        // Advanced compression
        collapse_vars: true,
        reduce_vars: true,
        reduce_funcs: true,
        // Remove unreachable code
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        // Inline small functions
        inline: 2,
        // Remove duplicate code
        join_vars: true,
        // Simplify sequences
        sequences: true,
      },
      format: {
        comments: false,
        // Use shortest possible syntax
        ecma: 2020,
      },
      // Mangle only variable names (safe)
      mangle: true,
    },
    // Code splitting for better caching and smaller initial bundle
    rollupOptions: {
      output: {
        // Use content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: (id) => {
          // Granular vendor splitting for better caching and smaller chunks
          if (id.includes('node_modules')) {
            // React core (smallest possible chunks)
            if (id.includes('react/') && !id.includes('react-dom')) {
              return 'react-core';
            }
            if (id.includes('react-dom/')) {
              return 'react-dom';
            }
            
            // Router (separate chunk)
            if (id.includes('react-router')) {
              return 'react-router';
            }
            
            // Lucide icons (can be lazy loaded)
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Scheduler (React internal)
            if (id.includes('scheduler')) {
              return 'scheduler';
            }
            
            // Any other vendor libraries (if added in future)
            // Only create vendor chunk if there are actually other dependencies
            // For now, all dependencies are specifically chunked above
          }
          
          // Split out components by route/section for better lazy loading
          if (id.includes('src/components/')) {
            // Keep navbar and critical components in main bundle
            if (id.includes('Navbar') || id.includes('Hero') || id.includes('ThemeContext')) {
              return undefined; // Include in main bundle
            }
            // Lazy-loaded components get their own chunks
            return 'components';
          }
        },
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
    chunkSizeWarningLimit: 500,
    // Enable module preload for faster loading of dependencies
    modulePreload: {
      polyfill: true, // Enable polyfill to ensure modulepreload works across browsers
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Only preload critical chunks
        return deps.filter(dep => {
          // Preload React core chunks immediately
          return dep.includes('react-core') || 
                 dep.includes('react-dom') || 
                 dep.includes('scheduler');
        });
      },
    },
    // Improve build performance
    reportCompressedSize: false, // Skip gzip size reporting to speed up build
    // Set smaller chunk size for better loading performance
    assetsInlineLimit: 4096, // Inline assets < 4kb
  },
  server: {
    proxy: {
      // Local dev: forward API requests to the Express server (Nodemailer endpoint)
      '/api': 'http://localhost:3000',
    },
  },
})

