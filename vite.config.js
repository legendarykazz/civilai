import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://nelsonmontez95.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => '/webhook/a813426f-1e24-4114-a2fc-1de9a9216d1a/chat',
      }
    }
  },
})
