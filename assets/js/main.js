(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "nexuspulse-lang";

  var meta = {
    en: {
      title: "NexusPulse | Software outsourcing & product development studio",
      description: "NexusPulse builds web platforms, Web3 products and business automation for startups and growing companies. Based in Ho Chi Minh City, Viet Nam.",
      toggleText: "VI",
      toggleLabel: "Chuyển sang tiếng Việt"
    },
    vi: {
      title: "NexusPulse | Studio outsource phần mềm và phát triển sản phẩm",
      description: "NexusPulse xây dựng nền tảng web, sản phẩm Web3 và hệ thống tự động hoá cho startup và doanh nghiệp đang tăng trưởng. Trụ sở tại TP. Hồ Chí Minh.",
      toggleText: "EN",
      toggleLabel: "Switch to English"
    }
  };

  function readStoredLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* Storage can be unavailable (private mode). The page still works. */
    }
  }

  function isSupported(lang) {
    return lang === "en" || lang === "vi";
  }

  function initialLang() {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isSupported(fromUrl)) return fromUrl;
    var stored = readStoredLang();
    if (isSupported(stored)) return stored;
    var browser = (navigator.language || "").toLowerCase();
    return browser.indexOf("vi") === 0 ? "vi" : "en";
  }

  function applyLang(lang) {
    var texts = document.querySelectorAll("[data-vi]");
    for (var i = 0; i < texts.length; i++) {
      var el = texts[i];
      if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
      el.textContent = el.getAttribute(lang === "vi" ? "data-vi" : "data-en");
    }

    var labels = document.querySelectorAll("[data-vi-label]");
    for (var j = 0; j < labels.length; j++) {
      var item = labels[j];
      if (!item.hasAttribute("data-en-label")) item.setAttribute("data-en-label", item.getAttribute("aria-label") || "");
      item.setAttribute("aria-label", item.getAttribute(lang === "vi" ? "data-vi-label" : "data-en-label"));
    }

    root.lang = lang;
    document.title = meta[lang].title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", meta[lang].description);

    var toggle = document.querySelector(".lang-toggle");
    if (toggle) {
      toggle.textContent = meta[lang].toggleText;
      toggle.setAttribute("aria-label", meta[lang].toggleLabel);
    }
  }

  function setupLanguage() {
    var current = initialLang();
    if (current !== "en") applyLang(current);

    var toggle = document.querySelector(".lang-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      current = current === "en" ? "vi" : "en";
      applyLang(current);
      storeLang(current);
    });
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!button || !menu) return;

    function setOpen(open) {
      menu.setAttribute("data-open", open ? "true" : "false");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }

    button.addEventListener("click", function () {
      setOpen(menu.getAttribute("data-open") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    for (var j = 0; j < items.length; j++) observer.observe(items[j]);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupLanguage();
    setupMenu();
    setupReveal();
  });
})();
