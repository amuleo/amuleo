(function () {
  // ساختن المنت هدر
  const headerHTML = `
    <div class="header">
      <h1>عمو لئو هستم،</h1>
      <button class="theme-toggle" id="themeBtn" title="تغییر حالت">
        <i class="fas fa-sun" id="themeIcon"></i>
      </button>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .header {
      display: flex;
      position: fixed;
      justify-content: space-between;
      align-items: center;
      background-color: var(--card);
      padding: 15px;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      height: 60px;
    }

    .theme-toggle {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: none;
      background-color: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .theme-toggle i {
      color: var(--text);
      font-size: 18px;
    }
  `;
  document.head.appendChild(style);

  const headerWrapper = document.createElement("div");
  headerWrapper.innerHTML = headerHTML;
  document.body.prepend(headerWrapper);

  // تابع‌های کوکی
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function updateThemeColor(color) {
    let tag = document.querySelector('meta[name="theme-color"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'theme-color');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', color);
  }

  // حالت تم
  const btn = document.getElementById("themeBtn");
  const icon = document.getElementById("themeIcon");

  function applyTheme() {
    const isDark = getCookie("theme") === "dark";
    document.body.classList.toggle("dark", isDark);
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
    updateThemeColor(isDark ? "#333" : "#f9fafd");
  }

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    icon.className = isDark ? "fas fa-moon" : "fas fa-sun";
    setCookie("theme", isDark ? "dark" : "light", 365);
    updateThemeColor(isDark ? "#333" : "#f9fafd");
  });

  applyTheme();
})();
