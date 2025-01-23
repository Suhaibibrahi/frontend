const CACHE_NAME = "squadron-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/icons/c130j_192x192.png",
  "/assets/icons/c130j_512x512.png",
  "/assets/icons/c130j_1024x1024.png",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Fetch from Cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push Notification Event (Optional)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Push notification with no payload";
  event.waitUntil(
    self.registration.showNotification("Squadron App Notification", {
      body: data,
      icon: "/assets/icons/c130j_192x192.png",
    })
  );
});
