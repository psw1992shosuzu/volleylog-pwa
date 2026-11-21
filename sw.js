/* VOLLEY LOG v1.6: app shell cache only. Match data stays in browser local storage. */
const CACHE_NAME='volleylog-shell-v16-1';
const CORE=['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)));
 // Do not automatically take over a live scoring session.
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(k=>k.startsWith('volleylog-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
   event.respondWith((async()=>{
    try{return await fetch(request)}catch(e){
      const cached=await caches.match(new URL('./index.html',self.registration.scope).href);
      return cached||Response.error();
    }
   })());
   return;
 }
 event.respondWith((async()=>{
   const cached=await caches.match(request);
   if(cached)return cached;
   return fetch(request);
 })());
});
