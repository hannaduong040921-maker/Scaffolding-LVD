/* Thang Gợi Mở — cất app vào máy để mất mạng vẫn mở được.
   Đổi số BAN mỗi lần cập nhật app để máy HS lấy bản mới. */
const BAN = 'tgm-v2';
const TEP = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(BAN).then(c => c.addAll(TEP))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== BAN).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // bài nộp gửi về Google: không cất
  e.respondWith(caches.open(BAN).then(async c => {
    const cu = await c.match(e.request, {ignoreSearch: true}) || (e.request.mode === 'navigate' ? await c.match('./index.html') : undefined);
    const moi = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => cu);
    return cu || moi;   // có bản cất → mở ngay (kể cả mất mạng), đồng thời lặng lẽ lấy bản mới cho lần sau
  }));
});
