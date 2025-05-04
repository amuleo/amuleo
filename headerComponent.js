(function () {
  // ---------- اضافه کردن استایل‌های لازم برای تم و هدر ----------
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --bg: #eef1f6;
      --card: #ffffff;
      --border: #e5e5e5;
      --text: #333;
      --hover: #dbdce0;
    }

    body.dark {
      --bg: #212121;
      --card: #303030;
      --border: #666;
      --text: #f0f0f0;
      --hover: #1a1a1c;
      background-color: var(--bg);
      color: var(--text);
    }

    .header {
      display: flex;
      position: fixed;
      justify-content: space-between;
      align-items: center;
      background-color: var(--card);
      padding: 15px 20px;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      height: 60px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      font-family: sans-serif;
    }

    .header h1 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--text);
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
      transition: background-color 0.3s;
    }

    .theme-toggle i {
      color: var(--text);
      font-size: 18px;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      padding-top: 60px; /* فضای زیر هدر */
      transition: background-color 0.3s, color 0.3s;
    }
  `;
  document.head.appendChild(style);

  // ---------- HTML هدر ----------
  const headerHTML = `
    <div class="header">
      <h1>عمو لئو هستم،</h1>
      <button class="theme-toggle" id="themeBtn" title="تغییر حالت">
        <i class="fas fa-sun" id="themeIcon"></i>
      </button>
    </div>
  `;
  const headerWrapper = document.createElement("div");
  headerWrapper.innerHTML = headerHTML;
  document.body.prepend(headerWrapper);

  // ---------- متا تگ رنگ تم برای موبایل ----------
  function updateThemeColor(color) {
    let tag = document.querySelector('meta[name="theme-color"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = "theme-color";
      document.head.appendChild(tag);
    }
    tag.content = color;
  }

  // ---------- تابع‌های کوکی ----------
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  // ---------- رفتار تم ----------
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
