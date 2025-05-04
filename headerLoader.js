function loadHeader() {
    async function loadComponent(id, file) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('خطا در بارگذاری فایل');
            document.getElementById(id).innerHTML = await response.text();
            
            // اجرا کردن اسکریپت‌های هدر بعد از بارگذاری
            const script = document.createElement("script");
            script.src = "theme.js"; // اسکریپت تغییر تم
            document.body.appendChild(script);
        } catch (error) {
            console.error(error);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        loadComponent("header", "header.html");
    });
}
