// service-worker.js
const CACHE_NAME = 'zytask-v1.0.2'; // Updated cache version to force re-installation
const urlsToCache = [
    '/', // Caches the root path, assuming zytask.html is served from there
    '/zytask.html', // Explicitly cache the HTML file
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@33.003/misc/Farsi-Digits/Vazirmatn-FD-font-face.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    // Explicitly caching Font Awesome webfonts for better offline support on iOS/Safari
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.ttf',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.ttf',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.ttf'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all content');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to add URLs to cache during install:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. We must clone it so that we can
                // consume the stream twice: once for the cache and once for the network.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response.
                    // response.ok is true for 2xx status codes.
                    // We generally want to cache all successful responses, regardless of type (basic, cors).
                    // Opaque responses (type 'opaque') are tricky as their status cannot be inspected,
                    // but for fonts, they are often necessary to cache.
                    if (!response || !response.ok) {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and can only be consumed once. We must clone it so that
                    // we can consume the stream twice.
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        })
                        .catch(cacheError => {
                            console.error('Error putting response in cache:', cacheError);
                        });

                    return response;
                }).catch((error) => {
                    // If network request fails (e.g., offline), try to get from cache as a fallback.
                    console.error('Fetch failed; returning cached resource if available:', error);
                    return caches.match(event.request); // Try to return from cache if network fails
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim(); // Take control of all clients immediately
        })
    );
});

// Listener for messages from the main thread (e.g., from updateAppMenuItem)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
        console.log('[Service Worker] Received CLEAR_ALL_CACHES message. Clearing all caches...');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log(`[Service Worker] Deleting cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                console.log('[Service Worker] All caches cleared. Sending RELOAD_PAGE message.');
                // After clearing caches, send a message back to the client to reload the page
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => {
                        client.postMessage({ type: 'RELOAD_PAGE' });
                    });
                });
            })
        );
    }
});
