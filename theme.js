const btn = document.getElementById("themeBtn");
  const icon = document.getElementById("themeIcon");

  // تابع برای تنظیم کوکی
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // مدت زمان انقضای کوکی
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // تابع برای خواندن مقدار کوکی
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

  function updateThemeColor(color) {
    let themeMetaTag = document.querySelector('meta[name="theme-color"]');
    if (!themeMetaTag) {
        themeMetaTag = document.createElement('meta');
        themeMetaTag.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMetaTag);
    }
    themeMetaTag.setAttribute('content', color);
}

  // تغییر حالت شب و روز
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
    setCookie("theme", isDark ? "dark" : "light", 365); // ذخیره وضعیت در کوکی برای یک سال
     updateThemeColor(isDark ? "#333" : "#f9fafd"); // تغییر رنگ بر اساس تم
  });

  // بارگذاری وضعیت حالت شب/روز از کوکی هنگام بارگذاری صفحه
  window.addEventListener("load", () => {
    const saved = getCookie("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
      icon.className = "fas fa-moon";
    } else {
      icon.className = "fas fa-sun";
       updateThemeColor(isDark ? "#333" : "#f9fafd"); // تغییر رنگ بر اساس تم
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = getCookie("theme");
    const isDark = savedTheme === "dark";
    
    // اعمال حالت ذخیره‌شده
    document.body.classList.toggle("dark", isDark);
    document.getElementById("themeIcon").className = isDark ? "fas fa-moon" : "fas fa-sun";

    // تنظیم رنگ تم مرورگر
    updateThemeColor(isDark ? "#333" : "#f9fafd");
});
