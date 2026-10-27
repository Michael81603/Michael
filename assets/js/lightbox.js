function query(selector, root = document) {
  return root.querySelector(selector);
}

function queryAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

export function setupLightbox() {
  const images = queryAll("img.js-lightbox");
  if (!images.length) return;

  let overlay = query(".lightbox");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="lightbox-card" role="dialog" aria-modal="true" aria-labelledby="lightbox-caption">
        <img class="lightbox-img" alt="">
        <div class="lightbox-bar">
          <div class="lightbox-caption" id="lightbox-caption"></div>
          <div class="lightbox-actions">
            <button type="button" class="lightbox-btn" data-act="prev" aria-label="Image précédente">&#9664;</button>
            <button type="button" class="lightbox-btn" data-act="next" aria-label="Image suivante">&#9654;</button>
            <button type="button" class="lightbox-btn" data-act="close" aria-label="Fermer l’aperçu">Fermer</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const imageElement = query(".lightbox-img", overlay);
  const captionElement = query(".lightbox-caption", overlay);
  const closeButton = query('[data-act="close"]', overlay);
  const gallery = images.map((image) => ({
    src: image.getAttribute("src"),
    caption: image.getAttribute("alt") || image.getAttribute("data-caption") || "Capture du projet"
  }));

  let current = 0;
  let currentTrigger = null;
  let previousBodyOverflow = "";
  let backgroundState = new Map();

  function setBackgroundInteraction(disabled) {
    if (disabled) {
      backgroundState = new Map();
      Array.from(document.body.children).forEach((element) => {
        if (element === overlay) return;
        backgroundState.set(element, {
          inert: element.inert,
          ariaHidden: element.getAttribute("aria-hidden")
        });
        element.inert = true;
        element.setAttribute("aria-hidden", "true");
      });
      return;
    }

    backgroundState.forEach((state, element) => {
      element.inert = state.inert;
      if (state.ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", state.ariaHidden);
      }
    });
    backgroundState.clear();
  }

  function showImage(index) {
    current = (index + gallery.length) % gallery.length;
    imageElement.src = gallery[current].src;
    imageElement.alt = gallery[current].caption;
    captionElement.textContent = gallery[current].caption;
  }

  function openAt(index, trigger) {
    currentTrigger = trigger;
    showImage(index);
    previousBodyOverflow = document.body.style.overflow;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
    setBackgroundInteraction(true);
  }

  function close() {
    if (!overlay.classList.contains("open")) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    setBackgroundInteraction(false);

    if (currentTrigger && currentTrigger.isConnected) {
      currentTrigger.focus();
    }
  }

  images.forEach((image, index) => {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "lightbox-trigger";
    trigger.setAttribute("aria-label", `Agrandir l’image : ${gallery[index].caption}`);
    image.parentNode.insertBefore(trigger, image);
    trigger.appendChild(image);
    trigger.addEventListener("click", () => openAt(index, trigger));
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
      return;
    }

    const button = event.target.closest("button[data-act]");
    if (!button) return;

    const action = button.getAttribute("data-act");
    if (action === "close") close();
    if (action === "next") showImage(current + 1);
    if (action === "prev") showImage(current - 1);
  });

  overlay.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(current + 1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(current - 1);
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = queryAll(focusableSelector, overlay);
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (!first || !last) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
