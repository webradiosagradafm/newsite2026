import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      // injectManifest: usa o NOSSO sw.js (em src/sw.js) como base e
      // injeta a lista de assets pra cache dentro dele, em vez de
      // gerar um sw.js automático que sobrescreveria o nosso e
      // perderia a lógica que ignora o stream de áudio.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        // Evita que o manifesto de precache tente incluir o próprio
        // stream ou qualquer coisa não construída pelo Vite.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },

      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Praise FM USA',
        short_name: 'Praise FM',
        description: '24/7 Worship & Gospel Radio',
        theme_color: '#ff6600',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react'
            }

            if (
              id.includes('lucide-react') ||
              id.includes('swiper')
            ) {
              return 'ui'
            }

            return 'vendor'
          }
        }
      }
    }
  }
})