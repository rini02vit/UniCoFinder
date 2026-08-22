import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')
            ) {
              return 'vendor';
            }
            if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/lucide-react/')) {
              return 'ui';
            }
            if (id.includes('node_modules/react-hook-form/') || id.includes('node_modules/@hookform/resolvers/') || id.includes('node_modules/zod/')) {
              return 'forms';
            }
          }
        },
      },
    },
  },
});
