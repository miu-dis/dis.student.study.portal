// DIS Student Portal — Service Worker
// Cache-first strategy for assets, network-first for HTML

const CACHE_NAME = "dis-portal-v1";
const ASSETS_TO_CACHE = [
    "/",
    "/index.html",
    "/login.html",
    "/admin-dashboard.html",
    "/dept-gate-2026.html",
    "/assets/css/portal-ui.css",
    "/assets/css/toast.css",
    "/assets/css/ui-states.css",
    "/assets/css/mobile-app.css",
    "/assets/js/app.js",
    "/assets/js/i18n.js",
    "/assets/js/state.js",
    "/assets/js/toast.js",
    "/assets/js/sanitize.js",
    "/assets/js/portal-ui.js",
    "/assets/js/ui-states.js",
    "/assets/js/form-validation.js",
    "/assets/js/academicTerms.js",
    "/assets/js/courseUtils.js",
    "/assets/js/noticeFormat.js",
    "/assets/js/fileStorage.js",
    "/assets/js/supabase-config.js",
    "/assets/js/mobile-app.js",
    "/assets/js/portal/attendance.js",
    "/assets/js/portal/courses.js",
    "/assets/js/portal/routines.js",
    "/assets/js/portal/forum.js",
    "/assets/js/portal/dailyResources.js",
    "/assets/js/portal/upload.js",
    "/assets/js/admin/attendanceManager.js",
    "/assets/js/admin/courseMapper.js",
    "/assets/js/admin/forumManager.js",
    "/assets/js/admin/noticeManager.js",
    "/assets/js/admin/resourceManager.js",
    "/assets/js/admin/routineLedgerManager.js",
    "/assets/js/admin/routineManager.js",
    "/assets/js/admin/studentManager.js",
    "/assets/img/logo.png",
    "/assets/img/icon-192.png",
    "/assets/img/icon-512.png",
    "/assets/img/icon-512-maskable.png",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    "https://cdn.tailwindcss.com"
];

// Install — cache all static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn("[SW] Cache addAll partial failure:", err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch — cache-first for static assets, network-first for navigation
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== "GET") return;

    // Skip Firebase/Supabase API calls — always network
    if (
        url.hostname.includes("firebaseio.com") ||
        url.hostname.includes("googleapis.com") ||
        url.hostname.includes("supabase.co") ||
        url.hostname.includes("firestore.googleapis.com") ||
        url.hostname.includes("identitytoolkit.googleapis.com")
    ) {
        return;
    }

    // Skip CDN scripts (Tailwind, Font Awesome) — network-first
    if (
        url.hostname === "cdn.tailwindcss.com" ||
        url.hostname === "cdnjs.cloudflare.com"
    ) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Navigation requests — network-first
    if (request.mode === "navigate") {
        event.respondWith(networkFirst(request));
        return;
    }

    // Static assets — cache-first
    event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        // Offline fallback for images
        if (request.destination === "image") {
            return new Response("", { status: 204, statusText: "No Content" });
        }
        throw err;
    }
}

// Network-first strategy (with cache fallback)
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;

        // Offline fallback for navigation
        if (request.mode === "navigate") {
            return caches.match("/index.html");
        }
        throw err;
    }
}