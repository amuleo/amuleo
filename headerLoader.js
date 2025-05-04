async function loadComponent(id, file) {
    try {
        const response = await fetch(file, { credentials: "include" }); // ارسال کوکی‌ها
        if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
        document.getElementById(id).innerHTML = await response.text();
        console.log("✅ هدر لود شد!");

        // بارگذاری `theme.js` و اجرای تنظیمات تم
        let themeScript = document.createElement("script");
        themeScript.src = "theme.js";
        themeScript.onload = () => {
            applyThemeSettings(); // اجرای تابع تنظیمات پس از لود اسکریپت
        };
        document.body.appendChild(themeScript);
        console.log("🎨 `theme.js` لود شد و تنظیمات اعمال شدند!");
    } catch (error) {
        console.error(error);
    }
}

// تابع برای اعمال تنظیمات تم بر اساس کوکی
function applyThemeSettings() {
    const savedTheme = getCookie("theme");
    const isDark = savedTheme === "dark";

    document.body.classList.toggle("dark", isDark);
    document.getElementById("themeIcon").className = isDark ? "fas fa-moon" : "fas fa-sun";

    updateThemeColor(isDark ? "#333" : "#f9fafd");
}
