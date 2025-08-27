import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: import.meta.env?.DEV === true, // Only generate sourcemaps in development
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: import.meta.env?.PROD === true, // Only drop console in production
        drop_debugger: true,
        passes: 2
      },
      format: {
        comments: false
      }
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers/zod', 'zod'],
        },
      },
    },
  },
  // Add esbuild optimization for dev mode
  esbuild: {
    legalComments: 'none', // Remove license comments
    drop: ['debugger'], // Always drop debugger statements
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
})
