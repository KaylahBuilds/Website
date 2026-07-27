import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative so the build works on GitHub Pages
// regardless of repo name (HashRouter handles client-side routing).
export default defineConfig({
  plugins: [react()],
  base: './',
})
