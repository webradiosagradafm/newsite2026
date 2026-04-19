import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function registerPWA() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const { registerSW } = await import('virtual:pwa-register');

    registerSW({
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

registerPWA();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
