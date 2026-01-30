/* Praise FM USA – Production PWA Service Worker */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/**
 * Spotify/BBC pattern:
 * - não cacheia HTML
 * - não cacheia áudio
 * - apenas mantém controle do lifecycle
 */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Nunca intercepta stream de áudio
  if (request.destination === 'audio') {
    return;
  }

  // Pass-through network
});
