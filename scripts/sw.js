self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll([
            '/lifecare/',  // Update this path
            '/lifecare/index.html',  // Update this path
            '/lifecare/styles/lifecarehospital.css',  // Update this path
            '/lifecare/scripts/script.js',  // Update this path
            '/lifecare/favicons/favicon-32x32.png',  // Update this path
            'life care/favicons/favicon-16x16.png'  // Update this path
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });


  