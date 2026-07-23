/**
 * NEXO DIGITAL - SERVICE WORKER (PWA CACHING & OFFLINE ROCK ENGINE)
 */

const CACHE_NAME = 'nexo-digital-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/audio-player.js',
  './js/visualizer.js',
  './js/mass-composition.js',
  './js/podcasts.js',
  './js/schedule.js',
  './js/admin-dashboard.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass audio stream requests directly through network
  if (event.request.url.includes('zeno.fm') || event.request.url.includes('soundhelix')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
