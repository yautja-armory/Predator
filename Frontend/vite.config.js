import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- IMPORT REACT, NOT VUE

export default defineConfig({
  plugins: [react()], // <--- USE REACT PLUGIN
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})