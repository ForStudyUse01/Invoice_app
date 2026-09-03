import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the build load assets relatively, so it works from
// GitHub Pages project subpaths, Netlify, Vercel, or any static host.
export default defineConfig({
  plugins: [react()],
  base: './',
})
