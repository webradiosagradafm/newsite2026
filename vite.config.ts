import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Importe o plugin do v4
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adicione o plugin aqui
    VitePWA({
      registerType: 'autoUpdate',
      // suas outras configurações de PWA continuam aqui...
    })
  ],
});