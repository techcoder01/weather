'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9fa99fab69dac239f41ec06a844459f9",
"assets/assets/icons/1.1.png": "368e49bfcc3c173aa2a1ee6c8a7d169b",
"assets/assets/icons/1.2.png": "60b9a699cb16b5051b93daf013d68ab8",
"assets/assets/icons/2.1.png": "9875f029f0631b1724c07ed198d26b66",
"assets/assets/icons/2.2.png": "9fea2d59a7289e6bc2d6eb8af1e40114",
"assets/assets/icons/3.1.png": "e6db3722acd99c82348ec3e4457b3c6a",
"assets/assets/icons/3.2.png": "bd34376433fdc06246d5d223d141d8a4",
"assets/assets/icons/4.1.png": "bcbca1ba50bd3d5d657904ea5d2420d2",
"assets/assets/icons/4.2.png": "8bf3037a3a66f4ec14ea82f95ae60155",
"assets/assets/icons/5.png": "cab1b1362a3ca1edf291c257ce4f693b",
"assets/assets/icons/6.png": "368d744111a093d10cc0fe6c0d6a9d1f",
"assets/assets/img/1.png": "82e6f5d41b10e8b70df44fb9f9708e8c",
"assets/assets/img/10.png": "b80136255e4855543209708571145c47",
"assets/assets/img/11.png": "9f122ef7d107b607f4209a6c2d579f1b",
"assets/assets/img/12.png": "7ed9673e9189471c665eb15874f341af",
"assets/assets/img/13.png": "8c01fc9307ba4e095e9ba0262e4762e1",
"assets/assets/img/14.png": "27348023a767eab69a3799fa652046f8",
"assets/assets/img/2.png": "1eea5e25a960242212c016af1a3ce656",
"assets/assets/img/3.png": "e29f2dd47ed3a658baeae5825a58ec5a",
"assets/assets/img/4.png": "a8df0d02f7e914898a702040dfa1dea3",
"assets/assets/img/5.png": "e2bcd058e619f27f6533080f8b7e9ecd",
"assets/assets/img/6.png": "8cdf2435c0f9076e8c5afceb5b9a66b6",
"assets/assets/img/7.png": "8a08a901ad64cd1ccda4f203ed35f5aa",
"assets/assets/img/8.png": "41aeea685e2ddfa9b8be470eaac2b35e",
"assets/assets/img/9.png": "1d8d94cf4a0b7593f32113c996e2ea6f",
"assets/assets/io.png": "015e0f6986c2994bd89d273340bbbf7b",
"assets/assets/loading1.gif": "ecd7c4f00355e4174c09bbfe5069b8c2",
"assets/assets/myJson/file.json": "51c30ddb18a1cb8a46ceb1958edd74a5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "5c11a4f75697816e109e148810e453e1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "0a6571978e35da76142fa03e3dd103a1",
"/": "0a6571978e35da76142fa03e3dd103a1",
"main.dart.js": "35be69cf534d8729531ba58f587a3e96",
"manifest.json": "b154a9364e1d3d2aa52c55b7a7863999",
"version.json": "cb52daa919d6aa3bbe5d0f27829cdad0"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
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
