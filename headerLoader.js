async function loadComponent(id, file) {
  try {
    const response = await fetch(file, { credentials: "include" });
    if (!response.ok) throw new Error("❌ خطا در بارگذاری فایل");
    document.getElementById(id).innerHTML = await response.text();
    showMessage("✅ هدر لود شد!");

    // لود کردن theme.js بعد از بارگذاری موفق هدر
    let themeScript = document.createElement("script");
    themeScript.src = "theme.js";
    themeScript.onload = () => {
      applyThemeSettings(); // اعمال تم بر اساس کوکی
      setupThemeToggle();   // فعال‌سازی دکمه تغییر تم
      showMessage("🎨 theme.js لود شد و تنظیمات اعمال شدند!");
    };
    document.body.appendChild(themeScript);

  } catch (error) {
    showMessage("❌ خطا در بارگذاری فایل: " + error.message);
  }
}

function showMessage(msg) {
  document.body.insertAdjacentHTML("beforeend", `<p style="color: red;">${msg}</p>`);
}

function applyThemeSettings() {
  const savedTheme = getCookie("theme");
  const isDark = savedTheme === "dark";

  document.body.classList.toggle("dark", isDark);

  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
  }

  updateThemeColor(isDark ? "#333" : "#f9fafd");
}

// فقط برای اینکه getCookie در این فایل هم باشه
function getCookie(name) {
  let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
