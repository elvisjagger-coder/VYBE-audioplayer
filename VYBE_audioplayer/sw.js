// VYBE — service worker : l'application s'ouvre et fonctionne sans réseau.
// Stratégie : réseau d'abord (toujours la dernière version quand on est en ligne), copie locale en secours.
// Les fichiers audio/vidéo ne passent jamais ici : ils vivent dans IndexedDB.

const VERSION = 'vybe-shell-v1'
// Le logo existe sous /assets/ (projet Vite) ou à la racine (version à plat) : l'absent est simplement ignoré.
const SHELL = ['/', '/index.html', '/theme-init.js', '/favicon.png', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/assets/vybe-logo.png', '/vybe-logo.png']
const NETWORK_TIMEOUT_MS = 3000

const sameOrigin = url => new URL(url, self.location.origin).origin === self.location.origin

// Fichiers locaux cités par index.html (script, feuille de style, logo…) : leurs noms changent à chaque compilation.
const assetsIn = html => [...new Set([...html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:js|css|png|svg|webmanifest))"/g)].map(match => match[1]))]

async function cacheAll(cache, urls) {
  await Promise.allSettled(urls.map(url => cache.add(new Request(url, { cache: 'reload' }))))
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION)
    await cacheAll(cache, SHELL)
    try {
      const html = await (await fetch('/index.html', { cache: 'reload' })).text()
      await cacheAll(cache, assetsIn(html))
    } catch { /* hors ligne pendant l'installation : la copie se fera à la prochaine visite */ }
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith('vybe-shell-') && name !== VERSION) await caches.delete(name)
    await self.clients.claim()
  })())
})

// Après une visite en ligne : met en cache les nouveaux fichiers de l'application et retire les anciens.
async function refreshShell(response) {
  const cache = await caches.open(VERSION)
  const wanted = assetsIn(await response.text())
  await cacheAll(cache, wanted)
  for (const request of await cache.keys()) {
    const path = new URL(request.url).pathname
    if (/\.(?:js|css)$/.test(path) && path !== '/theme-init.js' && !wanted.includes(path)) await cache.delete(request)
  }
}

async function networkFirst(event) {
  const { request } = event
  const cache = await caches.open(VERSION)
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS))
    ])
    if (response && response.ok) {
      cache.put(request, response.clone())
      if (request.mode === 'navigate') event.waitUntil(refreshShell(response.clone()))
    }
    return response
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true })
    if (cached) return cached
    if (request.mode === 'navigate') return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error()
    return Response.error()
  }
}

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET' || !sameOrigin(request.url) || request.headers.has('range')) return
  event.respondWith(networkFirst(event))
})
