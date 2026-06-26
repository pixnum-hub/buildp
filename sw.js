// ─────────────────────────────────────────────────────────────────
//  PC Builder Service Worker  © 2026 Manik Roy. All Rights Reserved.
//  Deploy this file alongside index.html on HTTPS.
//  NOT loaded inside Claude preview (sandboxed iframe) — by design.
// ─────────────────────────────────────────────────────────────────
const CACHE_NAME = 'pcbuilder-v1';
const OFFLINE_URL = 'offline.html';

const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;500;700&display=swap'
];

// ── INSTALL: precache all static assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for static, network-first for API ─────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Exchange rate API — network first, fallback to cached or skip
  if (url.hostname === 'api.exchangerate-api.com') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Google Fonts — cache first
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        return res;
      }))
    );
    return;
  }

  // App shell — cache first, fallback to offline page
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }
        return res;
      }).catch(() =>
        event.request.mode === 'navigate'
          ? caches.match(OFFLINE_URL)
          : new Response('', { status: 408 })
      );
    })
  );
});

// ── BACKGROUND SYNC: rate refresh ────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'rate-sync') {
    event.waitUntil(
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(r => r.json())
        .then(d => {
          self.clients.matchAll().then(clients =>
            clients.forEach(c => c.postMessage({ type: 'RATE_UPDATE', rate: d.rates.INR }))
          );
        })
    );
  }
});

// ── PUSH NOTIFICATIONS (placeholder) ─────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'PC Builder', body: 'Your build is ready!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png'
    })
  );
});
