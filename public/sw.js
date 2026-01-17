
const CACHE_NAME = 'praise-fm-usa-v2';

// Essential UI assets to cache for offline availability
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
  'https://res.cloudinary.com/dtecypmsh/image/upload/v1766869698/SVGUSA_lduiui.webp'
];

// 1. Install Phase: Cache static UI assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching UI assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate Phase: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Phase: Smart caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL: Always skip caching for Live Stream and Metadata endpoints
  // Caching these will break the live radio functionality or cause memory leaks.
  if (url.hostname.includes('zeno.fm')) {
    return;
  }

  // Handle cross-origin images (Cloudinary, iTunes) with a stale-while-revalidate strategy
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchedResponse = fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  // Default strategy: Stale-while-revalidate for local assets and HTML
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Only cache valid GET responses
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback to home for navigation requests if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        throw err;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
