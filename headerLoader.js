async function loadComponent(id, file) {
    try {
        const response = await fetch(file, { credentials: "include" }); // ارسال کوکی‌ها
        if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
        document.getElementById(id).innerHTML = await response.text();
        showMessage("✅ هدر لود شد!");

        // بارگذاری `theme.js` و اجرای تنظیمات تم
        let themeScript = document.createElement("script");
        themeScript.src = "theme.js";
        themeScript.onload = () => {
            applyThemeSettings(); // اجرای تنظیمات تم بر اساس کوکی‌ها
        };
        document.body.appendChild(themeScript);
        showMessage("🎨 `theme.js` لود شد و تنظیمات اعمال شدند!");
    } catch (error) {
        showMessage("❌ خطا در بارگذاری فایل: " + error.message);
    }
}

// تابع برای نمایش پیام بدون `console.log()`
function showMessage(msg) {
    document.body.insertAdjacentHTML("beforeend", `<p style="color: red;">${msg}</p>`);
}

// تابع برای اعمال تنظیمات تم بر اساس کوکی
function applyThemeSettings() {
    const savedTheme = getCookie("theme");
    showMessage("🍪 مقدار کوکی 'theme': " + document.cookie);
    showMessage("🌗 حالت ذخیره‌شده: " + savedTheme);

    const isDark = savedTheme === "dark";

    document.body.classList.toggle("dark", isDark);
    document.getElementById("themeIcon").className = isDark ? "fas fa-moon" : "fas fa-sun";

    updateThemeColor(isDark ? "#333" : "#f9fafd");
}

// تابع خواندن کوکی
function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}
