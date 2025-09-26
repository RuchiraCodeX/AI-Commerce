import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/products': 'http://localhost:5000',
      '/cart': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    },
  },
})