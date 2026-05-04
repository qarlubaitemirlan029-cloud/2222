var CACHE = "cineverse-v2";
var ASSETS = [
  "/index.html",
  "/style.css",
  "/global.js",
  "/auth.js",
  "/manifest.json",
  "/kinopoisk.html",
  "/anime.html",
  "/minigames.html",
  "/music.html",
  "/news.html",
  "/weather.html",
  "/about.html"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if (e.request.url.indexOf("/api/") !== -1 || e.request.url.indexOf("/auth/") !== -1) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
