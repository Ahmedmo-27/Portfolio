// Service Worker for Ahmed Mostafa Portfolio - v2 (Robust & Modern)
// Provides offline support, caching, and handles network failures gracefully.

const STATIC_CACHE_NAME = 'portfolio-static-v2';
const DYNAMIC_CACHE_NAME = 'portfolio-dynamic-v2';
const ALL_CACHES = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];

// Assets to cache on install (critical for app shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
  // Add any other critical, non-hashed assets here.
];

// --------------------
// INSTALL
// --------------------
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching App Shell...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// --------------------
// ACTIVATE
// --------------------
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !ALL_CACHES.includes(name))
            .map((name) => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        )
      ),
      self.clients.claim()
    ])
  );
});

// --------------------
// FETCH
// --------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and API calls
  if (request.method !== 'GET' || url.pathname.startsWith('/api')) {
    return;
  }

  // Ignore browser extensions
  if (url.protocol.startsWith('chrome-extension:')) {
    return;
  }

  // Network First for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/index.html'));
    return;
  }

  // Cache First for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-While-Revalidate for everything else
  event.respondWith(staleWhileRevalidate(request));
});

// --------------------
// CACHING STRATEGIES
// --------------------

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const fetchRequest =
      request.url.startsWith(self.location.origin)
        ? request
        : new Request(request.url, { mode: 'no-cors' });

    const networkResponse = await fetch(fetchRequest);

    if (
      networkResponse.type === 'opaque' ||
      (networkResponse.ok && networkResponse.status !== 404)
    ) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error(`[SW] Cache First failed for ${request.url}`, error);
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function networkFirst(request, fallbackUrl) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log(`[SW] Network failed for ${request.url}, using cache`);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) return fallback;
    }

    return new Response('You are offline', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error(`[SW] SWR fetch failed for ${request.url}`, error);
      return null;
    });

  return cachedResponse || fetchPromise || new Response('Offline', { status: 503 });
}

// --------------------
// HELPERS
// --------------------

function isStaticAsset(url) {
  const patterns = [
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
    /\/assets\/.*\.[a-f0-9]+\.(js|css)$/i,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
    (u) => u.origin.includes('r2.dev')
  ];

  return patterns.some((pattern) =>
    typeof pattern === 'function'
      ? pattern(url)
      : pattern.test(url.pathname)
  );
}
