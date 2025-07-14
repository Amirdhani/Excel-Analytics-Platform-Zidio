import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // Enable SPA fallback for Netlify (also add _redirects file)
  resolve: {
    alias: {
      // optional aliases if needed
    },
  }
})
