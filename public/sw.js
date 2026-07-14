const CACHE_NAME = "halaqahid-offline-cache-v1";
const OFFLINE_URL = "/offline.html";

// Install phase: cache the offline page
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Offline page cached during install.");
      return cache.add(OFFLINE_URL);
    })
  );
  self.skipWaiting();
});

// Activate phase: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old offline cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch phase: intercept requests and serve offline fallback
self.addEventListener("fetch", (event) => {
  // Only intercept document navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log("Fetch failed; returning offline page fallback.", error);
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  }
});
