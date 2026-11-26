/*
 * Service worker: lets the page (and the payment QR codes) open with no signal after one visit.
 *
 * - Pages (the portfolio at / and the card at /card): network first (so edits show up right away), falling back to the
 *   cached copy of that page after 3s or offline.
 * - Everything else, including Next.js chunks and fonts: served from cache instantly and refreshed
 *   in the background.
 *
 * Bump VERSION when you rename or remove files in PRECACHE.
 */
const VERSION = 'v6'; // v6: drop caches poisoned by the ignoreSearch image bug
const CACHE = `nfc-card-${VERSION}`;
const PRECACHE = [
  '/',
  '/assets/avatar.jpg',
  '/assets/logos/newera.svg',
  '/assets/logos/hcmut.png',
  '/assets/logos/vietcombank.png',
  '/assets/logos/momo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

// One cache entry per page path: /?pay=vcb and / share the same copy.
function pageKey(request) {
  return new URL(request.url).pathname;
}

async function pageResponse(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([fetch(request), timeout(3000)]);
    if (response.ok) cache.put(pageKey(request), response.clone());
    return response;
  } catch {
    return (await cache.match(pageKey(request))) || Response.error();
  }
}

async function assetResponse(request, event) {
  const cache = await caches.open(CACHE);
  // Exact match, query string included: Next.js serves every image from /_next/image?url=…&w=…,
  // so ignoring the query would hand back the same cached image for all of them.
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return (await refresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_vercel/')) return; // analytics must hit the network

  if (request.mode === 'navigate') {
    event.respondWith(pageResponse(request));
  } else {
    event.respondWith(assetResponse(request, event));
  }
});
