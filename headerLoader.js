async function loadComponent(id, file) {
    try {
        const response = await fetch(file, { credentials: "include" }); // ارسال کوکی‌ها همراه درخواست
        if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
        document.getElementById(id).innerHTML = await response.text();
        console.log("✅ هدر لود شد!");

        // اجرای `theme.js` بعد از لود شدن هدر
        let themeScript = document.createElement("script");
        themeScript.src = "theme.js";
        themeScript.onload = () => {
            applyThemeSettings(); // اجرای تنظیمات تم بر اساس کوکی‌ها
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
    console.log("🍪 مقدار کوکی 'theme':", document.cookie);
    console.log("🌗 حالت ذخیره‌شده:", savedTheme);

    const isDark = savedTheme === "dark";

    document.body.classList.toggle("dark", isDark);
    document.getElementById("themeIcon").className = isDark ? "fas fa-moon" : "fas fa-sun";

    updateThemeColor(isDark ? "#333" : "#f9fafd"); // تنظیم رنگ تم مرورگر
}

// تابع خواندن کوکی
function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}
