import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 👇 IMPORTANTE
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 New version available');
  },
  onOfflineReady() {
    console.log('✅ App ready offline');
  },
});

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