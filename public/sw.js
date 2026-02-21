const CACHE_NAME = 'rhythm-explorer-v3';
const OFFLINE_HTML = new URL('index.html', self.registration.scope).toString();
const OFFLINE_CSS = new URL('index.css', self.registration.scope).toString();

const toCache = (request, response) => {
  if (!response || response.status !== 200 || response.type === 'opaque') return;
  caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_HTML, OFFLINE_CSS]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { request } = event;
  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          toCache(request, response);
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_HTML)))
    );
    return;
  }

  if (!isSameOrigin) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        toCache(request, response);
        return response;
      })
      .catch(() => caches.match(request))
  );
});
