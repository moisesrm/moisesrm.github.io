const CACHE_NAME = 'lista-compras-v2';
const ASSETS = [
    '/',
    'index.html',
    'styles.css',
    'app.js',
    'manifest.json',
    'icon-192.png',
    'icon-512.png',
    'favicon.svg',
    'favicon.ico'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).catch(() => {
                // Se falhar (offline ou erro de path), tenta servir o index.html
                if (e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            });
        })
    );
});

self.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

self.addEventListener('notificationclick', (e) => {
    e.notification.close();

    const reminderId = e.notification.data ? e.notification.data.reminderId : null;

    e.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            const existing = windowClients[0];

            if (existing) {
                return existing.focus().then(() => {
                    return existing.postMessage({ type: 'notification-click', reminderId: reminderId });
                });
            }

            const target = reminderId ? `/?lembrete=${encodeURIComponent(reminderId)}` : '/';
            return self.clients.openWindow(target);
        })
    );
});