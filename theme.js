// theme.js

const btn = document.getElementById("themeBtn");
const icon = document.getElementById("themeIcon");

// تابع برای تنظیم کوکی
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// تابع برای خواندن کوکی
function getCookie(name) {
  let nameEq = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
  }
  return "";
}

// تغییر حالت شب و روز
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
  setCookie("theme", isDark ? "dark" : "light", 365); // ذخیره وضعیت در کوکی برای یک سال
  updateThemeColor(isDark ? "#333" : "#f9fafd"); // تغییر رنگ تم مرورگر
}

// تغییر رنگ تم مرورگر
function updateThemeColor(color) {
  let themeMetaTag = document.querySelector('meta[name="theme-color"]');
  if (!themeMetaTag) {
    themeMetaTag = document.createElement('meta');
    themeMetaTag.setAttribute('name', 'theme-color');
    document.head.appendChild(themeMetaTag);
  }
  themeMetaTag.setAttribute('content', color);
}

// بارگذاری تم ذخیره شده
function applyThemeSettings() {
  const savedTheme = getCookie("theme");
  const isDark = savedTheme === "dark";

  document.body.classList.toggle("dark", isDark);
  icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
  updateThemeColor(isDark ? "#333" : "#f9fafd");

  // افزودن event listener به دکمه تم
  btn.addEventListener("click", toggleTheme);
}

// بارگذاری وضعیت تم از کوکی هنگام بارگذاری صفحه
window.addEventListener("load", applyThemeSettings);
