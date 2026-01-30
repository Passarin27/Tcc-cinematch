const CACHE_NAME = "cinematch-v1";

const FILES_TO_CACHE = [
  "index.html",
  "cadastro.html",
  "home.html",
  "listas.html",
  "configuracoes.html",
  "mobile.css",
  "mobile.js",
  "home.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
