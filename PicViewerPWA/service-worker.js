// キャッシュ名
const CACHE_NAME = 'picviewer-cache-v1';
// キャッシュするリソースのリスト
const urlsToCache = [
  '/',
  'index.html',
  'image.png',
  'icon-192.png',
  'icon-512.png'
];

// インストール時にキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時にキャッシュから返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
