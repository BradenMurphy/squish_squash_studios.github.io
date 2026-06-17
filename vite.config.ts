import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works both on a GitHub Pages project subpath
// (e.g. /squish_squash_studios.github/) and on the custom domain.
//
// The build emits a SINGLE JS file + SINGLE CSS file with stable names, and
// Vite injects both tags into the generated dist/index.html automatically:
//   dist/assets/squish-squash.js
//   dist/assets/squish-squash.css
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // one entry chunk, no vendor splitting -> single JS file
        manualChunks: undefined,
        entryFileNames: 'assets/squish-squash.js',
        chunkFileNames: 'assets/squish-squash.js',
        assetFileNames: (info) =>
          info.names?.some((n) => n.endsWith('.css'))
            ? 'assets/squish-squash.css'
            : 'assets/[name][extname]',
      },
    },
  },
})
