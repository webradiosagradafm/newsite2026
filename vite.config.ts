import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 👈 ESSENCIAL para Codespaces / GitHub / Vercel preview
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
