(() => {
  "use strict";

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // Toast
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
  function toast(msg) {
    const el = ensureToast();
    el.textContent = msg;
    el.classList.add("toast-show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove("toast-show"), 1500);
  }

  // Back to top button
  function setupBackToTop() {
    if (qs("#backToTop")) return;
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.title = "Retour en haut";
    btn.setAttribute("aria-label", "Retour en haut");
    btn.textContent = "↑";
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(btn);

    const onScroll = () => {
      btn.style.display = window.scrollY > 300 ? "flex" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Smooth scroll for internal anchor links
  function setupSmoothAnchors() {
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = qs(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // Reveal on scroll
  function setupReveal() {
    const sections = qsa(".section");
    if (!sections.length) return;

    sections.forEach(s => s.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
      sections.forEach(s => s.classList.add("reveal-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(s => io.observe(s));
  }

  // Copy to clipboard helper
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }

  function setupCopyButtons() {
    qsa("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy") || "";
        const ok = await copyText(value);
        toast(ok ? "Copié " : "Impossible de copier");
      });
    });
  }

  // Lightbox for portfolio images
  function setupLightbox() {
    const imgs = qsa("img.js-lightbox, img.image-portfolio");
    if (!imgs.length) return;

    // build overlay once
    let overlay = qs(".lightbox");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.innerHTML = `
        <div class="lightbox-card" role="dialog" aria-modal="true" aria-label="Aperçu image">
          <img class="lightbox-img" alt="">
          <div class="lightbox-bar">
            <div class="lightbox-caption"></div>
            <div class="lightbox-actions">
              <button type="button" class="lightbox-btn" data-act="prev">◀</button>
              <button type="button" class="lightbox-btn" data-act="next">▶</button>
              <button type="button" class="lightbox-btn" data-act="close">Fermer</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const imgEl = qs(".lightbox-img", overlay);
    const capEl = qs(".lightbox-caption", overlay);

    let current = 0;
    const list = imgs.map((img) => ({
      src: img.getAttribute("src"),
      caption: img.getAttribute("data-caption") || img.getAttribute("alt") || ""
    }));

    function openAt(index) {
      current = (index + list.length) % list.length;
      imgEl.src = list[current].src;
      imgEl.alt = list[current].caption || "Aperçu";
      capEl.textContent = list[current].caption;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
    function next() { openAt(current + 1); }
    function prev() { openAt(current - 1); }

    imgs.forEach((img, idx) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openAt(idx));
    });

    overlay.addEventListener("click", (e) => {
      // click outside the card closes
      if (e.target === overlay) close();
    });

    overlay.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      if (act === "close") close();
      if (act === "next") next();
      if (act === "prev") prev();
    });

    window.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
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