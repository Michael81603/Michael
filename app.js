(() => {
  "use strict";

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  let toastEl = null;
  let toastTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;

    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);

    return toastEl;
  }

  function toast(message) {
    const el = ensureToast();
    el.textContent = message;
    el.classList.add("toast-show");

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      el.classList.remove("toast-show");
    }, 1500);
  }

  function setupBackToTop() {
    if (qs("#backToTop")) return;

    const button = document.createElement("button");
    button.id = "backToTop";
    button.type = "button";
    button.title = "Retour en haut";
    button.setAttribute("aria-label", "Retour en haut");
    button.textContent = "\u2191";
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(button);

    const onScroll = () => {
      button.style.display = window.scrollY > 300 ? "flex" : "none";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupSmoothAnchors() {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = qs(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupReveal() {
    const sections = qsa(".section");
    if (!sections.length) return;

    sections.forEach((section) => section.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }

  function setupCopyButtons() {
    qsa("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.getAttribute("data-copy") || "";
        const ok = await copyText(value);
        toast(ok ? "Copie effectuee" : "Impossible de copier");
      });
    });
  }

  function setupLightbox() {
    const images = qsa("img.js-lightbox, img.image-portfolio");
    if (!images.length) return;

    let overlay = qs(".lightbox");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.innerHTML = `
        <div class="lightbox-card" role="dialog" aria-modal="true" aria-label="Apercu image">
          <img class="lightbox-img" alt="">
          <div class="lightbox-bar">
            <div class="lightbox-caption"></div>
            <div class="lightbox-actions">
              <button type="button" class="lightbox-btn" data-act="prev">&#9664;</button>
              <button type="button" class="lightbox-btn" data-act="next">&#9654;</button>
              <button type="button" class="lightbox-btn" data-act="close">Fermer</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const imageEl = qs(".lightbox-img", overlay);
    const captionEl = qs(".lightbox-caption", overlay);

    let current = 0;
    const gallery = images.map((image) => ({
      src: image.getAttribute("src"),
      caption: image.getAttribute("data-caption") || image.getAttribute("alt") || ""
    }));

    function openAt(index) {
      current = (index + gallery.length) % gallery.length;
      imageEl.src = gallery[current].src;
      imageEl.alt = gallery[current].caption || "Apercu";
      captionEl.textContent = gallery[current].caption;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    function next() {
      openAt(current + 1);
    }

    function prev() {
      openAt(current - 1);
    }

    images.forEach((image, index) => {
      image.style.cursor = "zoom-in";
      image.addEventListener("click", () => openAt(index));
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });

    overlay.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-act]");
      if (!button) return;

      const action = button.getAttribute("data-act");
      if (action === "close") close();
      if (action === "next") next();
      if (action === "prev") prev();
    });

    window.addEventListener("keydown", (event) => {
      if (!overlay.classList.contains("open")) return;

      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    });
  }

  function init() {
    setupBackToTop();
    setupSmoothAnchors();
    setupReveal();
    setupCopyButtons();
    setupLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
