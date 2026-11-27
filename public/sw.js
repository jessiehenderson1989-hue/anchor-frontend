const CACHE_NAME = 'anchor-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle this app's own files. Fonts and other outside requests go straight to the network.
  if (new URL(event.request.url).origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Got a valid network response — clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed: use the saved copy. For a page the app has not saved yet,
        // show the app itself so the person is not left on a browser error page.
        return caches.match(event.request).then((hit) =>
          hit || (event.request.mode === 'navigate' ? caches.match('/index.html') : undefined)
        );
      })
  );
});
