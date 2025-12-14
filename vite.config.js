import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      'motion-utils': path.resolve(__dirname, 'node_modules/motion-utils/dist/cjs/index.js'),
    },
  },
  optimizeDeps: {
    include: ['framer-motion'],
  },
})

