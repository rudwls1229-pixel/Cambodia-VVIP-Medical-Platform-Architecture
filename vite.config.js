import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  base: '/Cambodia-VVIP-Medical-Platform-Architecture/',
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['ios >= 12', 'defaults', 'not IE 11'],
      polyfills: true
    }),
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            return 'vendor-others';
          }
        }
      }
    }
  }
})
