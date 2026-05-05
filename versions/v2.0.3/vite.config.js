import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite'; // CRITICAL ADDITION

export default defineConfig({
  plugins: [
    tailwindcss(), // ENABLE TAILWIND 4
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  base: '/Cambodia-VVIP-Medical-Platform-Architecture/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets_v202', 
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-motion';
            return 'vendor-libs';
          }
        }
      }
    }
  }
});
