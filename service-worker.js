// service-worker.js
// این Service Worker به طور خاص برای مدیریت کش و بروزرسانی‌های برنامه zytask.html طراحی شده است.
// تمامی عملیات کشینگ و پاکسازی داده‌ها در محدوده این برنامه انجام می‌شود.

const CACHE_NAME = 'zytask-v1.0.2'; // نسخه کش بروزرسانی شده برای اجبار به نصب مجدد
const urlsToCache = [
    '/', // کش کردن مسیر ریشه، با فرض اینکه zytask.html از آنجا سرو می‌شود
    '/zytask.html', // کش کردن صریح فایل HTML
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@33.003/misc/Farsi-Digits/Vazirmatn-FD-font-face.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    // کش کردن صریح فونت‌های Font Awesome برای پشتیبانی بهتر آفلاین در iOS/Safari
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.ttf',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.ttf',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-brands-400.ttf'
];

// شنونده رویداد 'install': هنگام نصب Service Worker فراخوانی می‌شود.
// این رویداد منابع ضروری برنامه را در کش ذخیره می‌کند تا برای استفاده آفلاین در دسترس باشند.
self.addEventListener('install', (event) => {
    console.log('[Service Worker] در حال نصب...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] در حال کش کردن تمامی محتوا...');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('خطا در افزودن URL‌ها به کش در حین نصب:', error);
            })
    );
});

// شنونده رویداد 'fetch': هر درخواست شبکه را رهگیری می‌کند.
// این رویداد ابتدا سعی می‌کند پاسخ را از کش برگرداند؛ اگر در کش نبود، درخواست را از شبکه دریافت می‌کند.
// این رفتار، قابلیت آفلاین را برای zytask.html و منابع وابسته به آن فراهم می‌کند.
self.addEventListener('fetch', (event) => {
    // فقط درخواست‌های GET را رهگیری می‌کنیم
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // اگر در کش یافت شد، پاسخ را برگردان
                if (response) {
                    return response;
                }

                // مهم: درخواست را کلون کنید. یک درخواست یک جریان است و فقط یک بار می‌تواند مصرف شود.
                // ما باید آن را کلون کنیم تا بتوانیم جریان را دو بار مصرف کنیم: یک بار برای کش و یک بار برای شبکه.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // بررسی می‌کنیم که آیا پاسخ معتبری دریافت کرده‌ایم.
                    // response.ok برای کدهای وضعیت 2xx صحیح است.
                    // ما معمولاً می‌خواهیم تمامی پاسخ‌های موفقیت‌آمیز را، صرف نظر از نوع (basic, cors)، کش کنیم.
                    // پاسخ‌های مبهم (نوع 'opaque') پیچیده هستند زیرا وضعیت آن‌ها قابل بررسی نیست،
                    // اما برای فونت‌ها، کش کردن آن‌ها اغلب ضروری است.
                    if (!response || !response.ok) {
                        return response;
                    }

                    // مهم: پاسخ را کلون کنید. یک پاسخ یک جریان است
                    // و فقط یک بار می‌تواند مصرف شود. ما باید آن را کلون کنیم تا
                    // بتوانیم جریان را دو بار مصرف کنیم.
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        })
                        .catch(cacheError => {
                            console.error('خطا در قرار دادن پاسخ در کش:', cacheError);
                        });

                    return response;
                }).catch((error) => {
                    // اگر درخواست شبکه با شکست مواجه شد (مثلاً آفلاین بود)، سعی کنید به عنوان یک جایگزین از کش دریافت کنید.
                    console.error('دریافت اطلاعات با شکست مواجه شد؛ در صورت موجود بودن، منبع کش شده برگردانده می‌شود:', error);
                    return caches.match(event.request); // سعی کنید در صورت شکست شبکه، از کش برگردانید
                });
            })
    );
});

// شنونده رویداد 'activate': هنگام فعال شدن Service Worker فراخوانی می‌شود.
// این رویداد کش‌های قدیمی را پاک می‌کند تا اطمینان حاصل شود که فقط آخرین نسخه برنامه استفاده می‌شود.
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] در حال فعال‌سازی...');
    const cacheWhitelist = [CACHE_NAME]; // لیست کش‌های مجاز (فقط کش فعلی)
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // حذف کش‌های قدیمی
                        console.log('[Service Worker] در حال حذف کش قدیمی:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] در حال تصاحب کلاینت‌ها (صفحات برنامه)...');
            return self.clients.claim(); // کنترل تمامی کلاینت‌ها را بلافاصله در دست می‌گیرد
        })
    );
});

// شنونده پیام‌ها از رشته اصلی (مثلاً از zytask.html).
// این بخش مسئول مدیریت دستور بروزرسانی عمیق از برنامه zytask.html است.
self.addEventListener('message', (event) => {
    // بررسی می‌کنیم که پیام از zytask.html و از نوع START_DEEP_UPDATE باشد.
    if (event.data && event.data.type === 'START_DEEP_UPDATE') {
        console.log('[Service Worker] پیام START_DEEP_UPDATE دریافت شد. در حال پاکسازی تمامی کش‌ها و لغو ثبت...');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                // تمامی کش‌های Service Worker را پاک می‌کنیم.
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log(`[Service Worker] در حال حذف کش: ${cacheName}`);
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                // کلیدهای localStorage که باید در صفحه اصلی حفظ شوند.
                // این لیست باید با لیست موجود در zytask.html یکسان باشد.
                const keysToPreserve = [
                    'tasks',
                    'zPoint',
                    'level',
                    'dailyStreak',
                    'highestDailyStreak',
                    'lastCompletionDate',
                    'totalCustomTasksCompleted',
                    'userName',
                    'userCreationDate',
                    'unlockedAchievements',
                    'achievementUnlockDates',
                    'hasPinnedTaskEver',
                    'theme' // حفظ تم برنامه
                ];

                console.log('[Service Worker] تمامی کش‌ها پاک شدند. در حال لغو ثبت Service Worker و ارسال پیام به کلاینت.');
                // Service Worker خودش را لغو ثبت می‌کند تا مرورگر نسخه جدید را نصب کند.
                return self.registration.unregister().then(() => {
                    // پیام را به کلاینت (صفحه zytask.html) ارسال می‌کنیم تا پاکسازی localStorage و بارگذاری مجدد را انجام دهد.
                    self.clients.matchAll().then(clients => {
                        clients.forEach(client => {
                            client.postMessage({
                                type: 'PERFORM_LOCAL_STORAGE_CLEANUP_AND_RELOAD',
                                keysToPreserve: keysToPreserve
                            });
                        });
                    });
                });
            })
        );
    }
});
