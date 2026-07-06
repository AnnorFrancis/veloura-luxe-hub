import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// META Men — leave base flexible; set BASE_URL at build time when deploying to gh-pages
export default defineConfig({
  plugins: [react()],
  base: '/meta-men/',
})
