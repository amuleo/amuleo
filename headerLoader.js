async function loadComponent(id, file) {
    try {
        const response = await fetch(file, { credentials: "include" }); // ارسال کوکی‌ها همراه درخواست
        if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
        document.getElementById(id).innerHTML = await response.text();
        console.log("✅ هدر لود شد!");

        // اجرای صحیح `theme.js` بعد از لود `header.html`
        let themeScript = document.createElement("script");
        themeScript.src = "theme.js";
        themeScript.defer = true; // اجرای پس از پردازش کامل DOM
        document.body.appendChild(themeScript);
        console.log("🎨 اسکریپت تم لود شد!");
    } catch (error) {
        console.error(error);
    }
}

// اجرا در بارگذاری صفحه
document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
});
