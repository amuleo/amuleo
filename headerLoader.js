// headerLoader.js

async function loadComponent(id, file) {
  try {
    const response = await fetch(file, { credentials: "include" }); // ارسال کوکی‌ها
    if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
    document.getElementById(id).innerHTML = await response.text();
    console.log("✅ هدر لود شد!");

    // بعد از بارگذاری هدر، اسکریپت تم را بارگذاری و اعمال می‌کنیم
    loadThemeScript();
  } catch (error) {
    console.error("❌ خطا در بارگذاری فایل: " + error.message);
  }
}

function loadThemeScript() {
  let themeScript = document.createElement("script");
  themeScript.src = "theme.js"; // مسیر به اسکریپت تم
  themeScript.onload = () => {
    console.log("🎨 `theme.js` لود شد و تنظیمات اعمال شدند!");
    applyThemeSettings(); // اعمال تنظیمات تم بر اساس کوکی‌ها
  };
  document.body.appendChild(themeScript);
}

// فراخوانی بارگذاری هدر
loadComponent("header", "header.html");
