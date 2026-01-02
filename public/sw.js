// Production-ready service worker
// - Dynamic precache of hashed assets by parsing /index.html at install
// - Precaches app shell: /, /index.html, /manifest.json, /favicon.svg
// - NetworkFirst for navigation with offline fallback
// - CacheFirst for static hashed assets (js/css/images/icons)
// - Stale-While-Revalidate for other GET requests

const CACHE_VERSION = 'v1';
const PRECACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME = `app-runtime-${CACHE_VERSION}`;
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

// Utility to check same-origin
const isSameOrigin = (url) => new URL(url, self.location).origin === self.location.origin;

// Install: precache core assets and try to parse index.html to discover hashed assets
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    // Always ensure core shell cached (do not fail install if parsing fails)
    await cache.addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: 'no-cache' })));

    // Try to fetch index.html and parse for hashed JS/CSS
    try {
      const resp = await fetch('/index.html', { cache: 'no-cache' });
      if (resp && resp.ok) {
        const text = await resp.text();
        const assetUrls = new Set();

        // Find <link rel="stylesheet" href="..."> and <script src="...">
        const cssRegex = /<link[^>]+href=["']([^"']+\.css)["'][^>]*>/g;
        const jsRegex = /<script[^>]+src=["']([^"']+\.js)["'][^>]*>/g;

        let m;
        while ((m = cssRegex.exec(text))) {
          try { assetUrls.add(new URL(m[1], location.origin).pathname); } catch(e){}
        }
        while ((m = jsRegex.exec(text))) {
          try { assetUrls.add(new URL(m[1], location.origin).pathname); } catch(e){}
        }

        // Only keep same-origin assets
        const toCache = Array.from(assetUrls).filter((p) => p && p.startsWith('/'));
        if (toCache.length) {
          // Add with no-cache to ensure we get latest hashed files
          await Promise.all(toCache.map((u) => cache.add(new Request(u, { cache: 'no-cache' }))));
        }
      }
    } catch (err) {
      // Parsing index.html failed — proceed with core cached assets only
    }

    await self.skipWaiting();
  })());
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (k !== PRECACHE && k !== RUNTIME) return caches.delete(k);
      return Promise.resolve(true);
    }));
    await self.clients.claim();
  })());
});

// Fetch handler: routing and strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // Ignore browser extensions and non-http(s)
  if (!request.url.startsWith(self.location.origin) && !request.url.startsWith('http')) return;
  const url = new URL(request.url);
  if (url.protocol.startsWith('chrome-extension:')) return;

  // Ignore API calls (server-driven endpoints)
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth') || url.pathname.includes('/graphql')) return;

  // Navigation requests — Network First with fallback to cached index.html or a safe offline page
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: JS/CSS/images/icons (Cache First)
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // All other GET requests: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// --- Strategies ---

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put('/index.html', response.clone());
    return response;
  } catch (err) {
    // Prefer cached navigation response
    const cachedIndex = await caches.match('/index.html');
    if (cachedIndex) return cachedIndex;
    // Safe inline fallback
    return new Response(`<!doctype html><meta charset="utf-8"><title>Offline</title><meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:2rem;color:#222}</style>` +
      `<h1>Offline</h1><p>The application is offline.</p>`, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    // Only cache successful, non-opaque responses
    if (response && response.ok && response.type !== 'opaque') {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Return cached if available, otherwise fallback to a generic Response
    const fall = await caches.match(request);
    if (fall) return fall;
    return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.ok && networkResponse.type !== 'opaque') {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cached || (await fetchPromise) || new Response(null, { status: 504, statusText: 'Gateway Timeout' });
}

// --- Helpers ---

function isStaticAsset(url) {
  // Treat same-origin .js/.css and common image/icon extensions as static assets
  if (!isSameOrigin(url)) return false;
  return /\.(?:js|css|jpg|jpeg|png|gif|webp|svg|ico|json)$/.test(url.pathname);
}

