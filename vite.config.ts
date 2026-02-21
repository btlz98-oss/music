import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  // GitHub Pages 하위 경로(예: /music/)에서도 정상 작동하도록 상대 경로 설정
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // viteSingleFile: inline all assets into a single HTML
    cssCodeSplit: false,
  }
})