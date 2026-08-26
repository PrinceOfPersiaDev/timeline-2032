const CACHE_NAME = "time-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-512.png"
];

/* =========================
   INSTALL
========================= */

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

/* =========================
   FETCH
========================= */

self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    /*
     * فایل‌های اصلی TIME:
     * اول اینترنت، بعد Cache
     */

    const isTimeFile =
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/script.js") ||
        url.pathname.endsWith("/manifest.json") ||
        url.pathname.endsWith("/sw.js");

    if (isTimeFile) {

        event.respondWith(

            fetch(event.request, {
                cache: "no-store"
            })
                .then((networkResponse) => {

                    if (
                        networkResponse &&
                        networkResponse.ok
                    ) {

                        const responseClone =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(
                                    event.request,
                                    responseClone
                                );
                            });
                    }

                    return networkResponse;
                })

                .catch(() => {
                    return caches.match(event.request);
                })
        );

        return;
    }

    /*
     * سایر فایل‌ها:
     * اول Cache، بعد اینترنت
     */

    event.respondWith(

        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {

                        if (
                            !networkResponse ||
                            !networkResponse.ok
                        ) {
                            return networkResponse;
                        }

                        const responseClone =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(
                                    event.request,
                                    responseClone
                                );
                            });

                        return networkResponse;
                    });
            })
    );
});
