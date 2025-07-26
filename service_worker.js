// Service Worker for MLB Wild Card Tracker
// Handles push notifications and offline caching

const CACHE_NAME = 'mlb-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/data.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Push event - handle push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'MLB Wild Card standings have been updated!',
        icon: 'https://cdn-icons-png.flaticon.com/512/33/33736.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/33/33736.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            url: '/'
        },
        actions: [
            {
                action: 'explore',
                title: 'View Standings',
                icon: 'https://cdn-icons-png.flaticon.com/512/33/33736.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: 'https://cdn-icons-png.flaticon.com/512/458/458594.png'
            }
        ],
        requireInteraction: true,
        tag: 'mlb-update'
    };

    event.waitUntil(
        self.registration.showNotification('🏆 MLB Wild Card Update!', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Background sync for updating data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Fetch latest data and cache it
        const response = await fetch('/data.json');
        const data = await response.json();
        
        // Cache the updated data
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/data.json', new Response(JSON.stringify(data)));
        
        // Check if it's notification time (7 AM EST)
        const now = new Date();
        const hour = now.getHours();
        
        if (hour === 7) {
            // Send notification if data is fresh
            await self.registration.showNotification('🏆 MLB Wild Card Update!', {
                body: 'Your daily wild card race update is ready!',
                icon: 'https://cdn-icons-png.flaticon.com/512/33/33736.png',
                tag: 'daily-update'
            });
        }
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'daily-update') {
        event.waitUntil(doBackgroundSync());
    }
});
