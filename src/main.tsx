import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 👇 IMPORTANTE
if ('serviceWorker' in navigator) {
  try {
    const { registerSW } = await import('virtual:pwa-register' as any);

    const updateSW = registerSW({
      onNeedRefresh() {
        console.log('🔄 New version available');
      },
      onOfflineReady() {
        console.log('✅ App ready offline');
      },
    });
  } catch (error) {
    console.warn('PWA registration failed:', error);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);