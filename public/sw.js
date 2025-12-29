// Service Worker for Ahmed Mostafa Portfolio - v5 (Fixed Font Caching)
// Provides offline support, caching, and handles network failures gracefully.
// v5: Fixed staleWhileRevalidate to return proper Response objects instead of null

const STATIC_CACHE_NAME = 'portfolio-static-v5';
const DYNAMIC_CACHE_NAME = 'portfolio-dynamic-v5';
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

  // Aggressive caching for Cloudflare beacon (30 days instead of 1 day)
  if (url.hostname === 'static.cloudflareinsights.com' && url.pathname.includes('beacon')) {
    event.respondWith(cacheFirstLongTerm(request));
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

async function cacheFirstLongTerm(request) {
  const cachedResponse = await caches.match(request);
  
  // If cached and still fresh (check Date header), return cached version
  if (cachedResponse) {
    const cachedDate = cachedResponse.headers.get('date');
    if (cachedDate) {
      const cacheAge = Date.now() - new Date(cachedDate).getTime();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      
      // Return cached version if less than 30 days old
      if (cacheAge < thirtyDays) {
        return cachedResponse;
      }
    } else {
      // No date header, return cached version anyway
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      // Clone and add custom header to track cache time
      const responseToCache = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: new Headers({
          ...Object.fromEntries(networkResponse.headers.entries()),
          'X-SW-Cached-Date': new Date().toISOString(),
          'Cache-Control': 'public, max-age=2592000, immutable' // 30 days
        })
      });
      cache.put(request, responseToCache);
      return networkResponse;
    }

    return networkResponse;
  } catch (error) {
    // Return cached version even if stale on network error
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error(`[SW] Cache First Long Term failed for ${request.url}`, error);
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

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
      // Return a proper offline response instead of null
      return new Response('Network error', {
        status: 408,
        statusText: 'Request Timeout',
        headers: { 'Content-Type': 'text/plain' }
      });
    });

  // If we have cached content, return it immediately
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for the network request
  return fetchPromise;
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
