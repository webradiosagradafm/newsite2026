self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Nunca interceptar stream de rádio
  if (
    url.includes("zeno.fm") ||
    url.includes("stream") ||
    url.endsWith(".mp3")
  ) {
    return;
  }

  event.respondWith(fetch(event.request));
});
