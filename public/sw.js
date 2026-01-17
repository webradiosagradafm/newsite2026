const CACHE_NAME = 'praise-fm-usa-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ❌ NUNCA mexer com streams
  if (request.url.includes('zeno.fm')) return;

  // ❌ NÃO cachear CDN ou fontes
  if (
    request.url.includes('cdn.tailwindcss.com') ||
    request.url.includes('googleapis.com') ||
    request.url.includes('gstatic.com')
  ) {
    return;
  }

  // Apenas GET
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // ⚠️ IMPORTANTE: só cacheia respostas válidas
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // fallback offline
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
