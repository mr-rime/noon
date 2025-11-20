const CACHE_NAME = "noon-static-v2";
const OFFLINE_URLS = ["/", "/index.html"];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)));
});

self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    // For navigations (page loads), use offline fallback to index.html
    if (request.mode === "navigate") {
        event.respondWith(caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match("/index.html"))));
        return;
    }

    // For static assets (scripts, styles, images etc.), just use cache-first
    // without falling back to HTML, to avoid serving index.html as a JS module.
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
