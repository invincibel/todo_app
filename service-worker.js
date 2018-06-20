var cacheName = 'app-shell-cache-v5';
var filesToCache = [

    '/',
    'index.html',
    'cssfile/1.css',
    'scripts/app.js',
    'images/ic_add_white_24px.svg',
    'images/ic_refresh_white_24px.svg'
];
self.addEventListener('install',function(event){
   console.log('sw install');
    event.waitUntil(
    caches.open(cacheName).then(function(cache){
       return cache.addAll(filesToCache); 
    }).then(function(){
        return self.skipWaiting();
    })
    );
});
self.addEventListener('activate',function(event){
   console.log('sw-activate'); 
    event.waitUntil(
     caches.keys().then(keyList=>{
         return Promise.all(keyList.map(key=>{
             if(key!==cacheName){
                 return caches.delete(key);
             }
         }));
     }));
    return self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});