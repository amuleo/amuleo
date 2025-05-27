// نام کش (Cache) برای نسخه‌های مختلف
const CACHE_NAME = 'offline-note-v1';

// لیستی از فایل‌هایی که باید کش شوند تا صفحه کاملاً آفلاین کار کند
const urlsToCache = [
    '/', // صفحه اصلی (مهم برای ریشه سایت)
    '/index.html', // فایل HTML اصلی
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap', // فونت وزیرمتن
    'https://cdn.tailwindcss.com' // Tailwind CSS
];

/**
 * رویداد 'install': هنگام نصب Service Worker فعال می‌شود.
 * در این مرحله، تمام فایل‌های ضروری را در کش مرورگر ذخیره می‌کنیم.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache all URLs:', error);
            })
    );
});

/**
 * رویداد 'fetch': هر درخواست شبکه از مرورگر از اینجا عبور می‌کند.
 * ابتدا سعی می‌کنیم پاسخ را از کش پیدا کنیم. اگر پیدا نشد، از شبکه دریافت می‌کنیم و آن را کش می‌کنیم.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // اگر پاسخ در کش موجود بود، آن را برمی‌گردانیم
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                // در غیر این صورت، درخواست را از شبکه دریافت می‌کنیم
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).then(
                    (response) => {
                        // بررسی می‌کنیم که آیا پاسخ معتبر است
                        // (مثلاً پاسخ شبکه موفقیت‌آمیز باشد و نه خطای 404 یا 500)
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // یک کپی از پاسخ را برای ذخیره در کش ایجاد می‌کنیم
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(error => {
                    // در صورت عدم موفقیت در دریافت از شبکه (مثلاً آفلاین بودن)
                    console.error('Service Worker: Fetch failed:', event.request.url, error);
                    // می‌توانید در اینجا یک صفحه آفلاین پیش‌فرض را برگردانید
                    // return caches.match('/offline.html');
                    return new Response('<h1>شما آفلاین هستید و این صفحه در کش موجود نیست.</h1>', {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                });
            })
    );
});

/**
 * رویداد 'activate': هنگام فعال شدن Service Worker جدید فعال می‌شود.
 * در این مرحله، کش‌های قدیمی را پاک می‌کنیم تا مطمئن شویم از آخرین نسخه فایل‌ها استفاده می‌شود.
 */
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // اگر نام کش در لیست سفید نبود، آن را حذف می‌کنیم
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
