import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite que funcione en GitHub Pages bajo cualquier nombre de repositorio
export default defineConfig({
  plugins: [react()],
  base: './',
})
