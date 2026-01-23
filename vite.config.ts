import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Isso deve parar de dar erro agora
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // O "motor" do Tailwind v4
    VitePWA({
      registerType: 'autoUpdate',
      // suas configurações de PWA...
    })
  ],
});