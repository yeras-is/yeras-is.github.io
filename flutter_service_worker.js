'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "80ee8a175569b94f3e075c0616608685",
"index.html": "d58fddec6fed0838b751a1fbdebf840e",
"/": "d58fddec6fed0838b751a1fbdebf840e",
"main.dart.js": "a4c52c06613e71f8e25e0ccbc6d17c18",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "18d44b0da0ef2c248482e36e2d50af04",
"assets/images/deathnote.jpg": "b1949137b96e7eed4da40edba5e25aa8",
"assets/images/netfologo.png": "92fd121d230988dd39fc13e8bb94de7c",
"assets/images/lotr.jpg": "dd08154878aac7c8c649fe3eeb8ccd0a",
"assets/images/pulpfiction.jpg": "310469ee34c3e3a75291b8c56c591994",
"assets/images/number.jpg": "8af130606588b1f0be791749c96f9b78",
"assets/images/thecrown.jpg": "f263fe6abe92bf48e28ce8ae41dc7f13",
"assets/images/wednesday.jpg": "41c01f8558cbbf9d3b15b46c0ea1b530",
"assets/images/theprestige.jpg": "3ed6977af051ad337e1b7a82eed23088",
"assets/images/annewithane.jpg": "f40ac302999ff96e902bbc563533baca",
"assets/images/joker.jpg": "dc2af4a3ddbc18b7b3f21c5c2c93ee0f",
"assets/images/friends.jpg": "2631d8fcdca20c412e66a124079ca1df",
"assets/images/theplatform.jpg": "691441da0f30798b6d88362a88c31cc4",
"assets/images/myoctopusteacher.jpg": "254463dbf000f5c2feffd5f0623b8d0f",
"assets/images/azizler.jpg": "e8d7dcee06288488076906f359ba3609",
"assets/images/greenmile.jpg": "9d803af5948f53cb3097ee996bbdf2d7",
"assets/images/bettercallsaul.jpg": "4427e3ba090ae76f5f77b75480a8ea38",
"assets/images/harrypotter.jpg": "db5d6e6af05d10757dcdd74b413cbaa9",
"assets/images/theshining.jpg": "f9c2c9bf39a59b72cd02a0821b373420",
"assets/images/it.jpg": "dd964c7e768a99349f1c4586ff594791",
"assets/images/emilyinparis.jpg": "75746d5de86e04aab80cf270ad59e7b2",
"assets/images/blackmirror.jpg": "62e6fcde9f70f82c48a51b99f585d13a",
"assets/images/breakingbad.jpg": "88c9d364c116816fb632b6be97a4f783",
"assets/images/gilmoregirls.jpg": "124fe4e698be7b1a81e95f6a1d99a11b",
"assets/images/himym.jpg": "087c78e324b94ba4b4dda771db38fd5b",
"assets/images/thetrumanshow.jpg": "08bb3d31fc67bef3069400f1dabf0c9a",
"assets/AssetManifest.json": "1a4c29ecd7f720c2d6a9b0fa0f774f0c",
"assets/NOTICES": "039d1e4968002cc0b458460440a71192",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "64ba80a65a13a6c4632b5f16012d7b4b",
"assets/fonts/MaterialIcons-Regular.otf": "649e3e59509b4c11b413febf8eccc763",
"canvaskit/skwasm.js": "6751619550a11b79e7a45d37478d7130",
"canvaskit/skwasm.wasm": "6a7d8b55bfe739d02bcdfa894bb785e2",
"canvaskit/chromium/canvaskit.js": "36d162e8f857ceeacbf01ed75a382f56",
"canvaskit/chromium/canvaskit.wasm": "e1c2d3e5513539627ebee43395b90dc5",
"canvaskit/canvaskit.js": "dd5b7e38ac853fcf41faa69cf49aa175",
"canvaskit/canvaskit.wasm": "e48f21ce5b69e56d7c1de16c87457c1e",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
