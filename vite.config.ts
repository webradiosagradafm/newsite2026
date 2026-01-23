import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Este é o "interruptor" que liga as cores do seu site
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        theme_color: "#ff6600",
        background_color: "#000000",
        display: "standalone"
      }
    })
  ],
});