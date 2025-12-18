import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
      'motion-utils': path.resolve(__dirname, 'node_modules/motion-utils/dist/cjs/index.js'),
    },
  },
  optimizeDeps: {
    include: ['framer-motion'],
  },
  server: {
    proxy: {
      // Local dev: forward API requests to the Express server (Nodemailer endpoint)
      '/api': 'http://localhost:3000',
    },
  },
})

