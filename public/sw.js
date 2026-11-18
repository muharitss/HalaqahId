const CACHE_NAME = "halaqahid-offline-cache-v2";
const OFFLINE_URL = "/offline.html";
const APP_SHELL_URLS = [OFFLINE_URL, "/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_URLS).catch(() => cache.add(OFFLINE_URL));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Cache-first for static Quran pages and fonts
  if (
    event.request.method === "GET" &&
    (url.pathname.startsWith("/api/quran/") ||
      url.pathname.startsWith("/api/sync/bootstrap") ||
      url.pathname.startsWith("/fonts/"))
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) return cachedResponse;
          throw new Error("Offline and not in cache");
        }
      })
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  }
});
