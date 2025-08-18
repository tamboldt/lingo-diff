import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuration for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/lingo-diff/' : '/',
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    
    // Optimize for performance
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'diff-vendor': ['diff']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true
  }
}) 