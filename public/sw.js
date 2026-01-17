const CACHE_NAME = 'praise-fm-usa-v2';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
];

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
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
  const url = new URL(request.url);

  // 🚫 NEVER cache live stream / radio metadata
  if (url.hostname.includes('zeno.fm')) return;

  // 🚫 Skip non-GET
  if (request.method !== 'GET') return;

  // 🖼 Images: stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetched = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);

        return cached || fetched;
      })
    );
    return;
  }

  // 📄 HTML / JS / CSS (app shell)
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((res) => {
            if (res.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, res.clone());
              });
            }
            return res;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
          });

        return cached || fetchPromise;
      })
    );
  }
});
