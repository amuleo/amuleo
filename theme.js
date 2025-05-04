// توابع عمومی برای مدیریت کوکی و رنگ تم
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  let nameEq = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
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

// فعال‌سازی دکمه‌ی تغییر تم
function setupThemeToggle() {
  const btn = document.getElementById("themeBtn");
  const icon = document.getElementById("themeIcon");

  if (!btn || !icon) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
    setCookie("theme", isDark ? "dark" : "light", 365);
    updateThemeColor(isDark ? "#333" : "#f9fafd");
  });
}
