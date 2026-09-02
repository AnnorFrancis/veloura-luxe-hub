import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from a project page at annorfrancis.github.io/veloura-luxe-hub/,
// so every asset URL needs that prefix. import.meta.env.BASE_URL carries it
// into the code that builds image paths.
export default defineConfig({
  plugins: [react()],
  base: '/veloura-luxe-hub/',
})
