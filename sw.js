const CACHE_NAME = 'vale-das-frutas-v11';
const ASSETS = [
  'index.html',
  'login.html',
  'cadastro.html',
  'perfil.html',
  'termos.html',
  'novo-pequeno.html',
  'escolha-personagem.html',
  'home.html',
  'crianca.html',
  'desempenho.html',
  'refeicoes.html',
  'configuracoes.html',
  'metas.html',
  'adicionar-meta.html',
  'style.css',
  'app.js',
  'firebase-config.js',
  'auth.js',
  'filhos.js',
  'metas.js',
  'alimentos.json',
  'manifest.json',
  'logo.png',
  'avatars/avatar1.jpg',
  'avatars/avatar2.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-512-maskable.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
