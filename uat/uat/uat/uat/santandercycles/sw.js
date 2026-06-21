// Minimal service worker — enables PWA installation.
// No caching is implemented since the app requires live TfL data.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
