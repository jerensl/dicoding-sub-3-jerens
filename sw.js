importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-stylesheets",
  })
);

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-webfonts",
  })
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  new workbox.strategies.CacheFirst({
    cacheName: "api-cache",
  })
);

workbox.routing.registerRoute(
  new RegExp("https://newsapi.org/v2/"),
  new workbox.strategies.CacheFirst({
    cacheName: "news-cache",
  })
);

workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  const options = {
    body: body,
    icon: "images/icon-512x512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});

workbox.precaching.precacheAndRoute([{"revision":"8e774b5d840279e77a39c7673d038a61","url":"club.html"},{"revision":"f61b2fb62bd9aff6046237388539e36c","url":"css/club.css"},{"revision":"ec1df3ba49973dcb9ff212f052d39483","url":"css/materialize.min.css"},{"revision":"31d192814c26721fae5fd92efadcc88d","url":"css/styles.css"},{"revision":"99f021db591d68e326967365c1cc6a6b","url":"favicon.ico"},{"revision":"e97fa811a0a513935c06866f33c2e771","url":"images/favicon-16x16.png"},{"revision":"04bc39fcd51ea6c968f55f715fe35f1d","url":"images/favicon-32x32.png"},{"revision":"2c315ade0aa005c8b40c82b97f1c2762","url":"images/favicon-96x96.png"},{"revision":"86541303cd226ec123b8e142d56d7769","url":"images/icon-144x144.png"},{"revision":"fb0f324a46e24c3cb070b5942ac1aec1","url":"images/icon-192x192.png"},{"revision":"837b3b384714739a4c19972962462bfa","url":"images/icon-36x36.png"},{"revision":"a1a55b3c722c980139249cca080a477b","url":"images/icon-48x48.png"},{"revision":"fec3f36dde4c2e1dbcd0571c745c420d","url":"images/icon-512x512.png"},{"revision":"d5c3dc4f35cdd373a30a96292135796b","url":"images/icon-72x72.png"},{"revision":"2c315ade0aa005c8b40c82b97f1c2762","url":"images/icon-96x96.png"},{"revision":"1962936c47a8a455b06abe8653124364","url":"index.html"},{"revision":"5e270801847ae669f373bff580f5489b","url":"js/app.js"},{"revision":"5fccfca842600f940e22bf391b79f846","url":"js/bootstrap.js"},{"revision":"14d072ec8ad7c6320cb56e6cb83adc1f","url":"js/club.js"},{"revision":"dbd18fd251f295d686c7ce778f8228e9","url":"js/components.js"},{"revision":"ea98f0811f944010a481f992eedeec38","url":"js/db.js"},{"revision":"6c82b47289a021659bcaa935581eefb8","url":"js/idb.js"},{"revision":"5dcfc8944ed380b2215dc28b3f13835f","url":"js/materialize.min.js"},{"revision":"b4e0382906d2dd9e28719eba0cef50f7","url":"js/renders.js"},{"revision":"926b2bea791125e4745fbf379352327d","url":"js/utils.js"},{"revision":"64a02aaa966ebf79838e5db856863a77","url":"manifest.json"},{"revision":"377304485dc3f285e41ea2e1a0001659","url":"nav.html"},{"revision":"4672440b1ef632ed663a1556e876660e","url":"pages/about.html"},{"revision":"a3a4952b9f87a7beba3c9df49379d123","url":"pages/favorite.html"},{"revision":"7a86bb67ac029ae0d98ee8b8f6731f20","url":"pages/home.html"},{"revision":"9187e7736a7300aff5ff24f0b71e43da","url":"pages/match.html"},{"revision":"8dc1f3c5bdd591577f6abc2828753bfd","url":"pages/standings.html"}]);
