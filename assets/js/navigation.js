function queryAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export function setupBackToTop() {
  if (document.querySelector("#backToTop")) return;

  const button = document.createElement("button");
  button.id = "backToTop";
  button.type = "button";
  button.title = "Retour en haut";
  button.setAttribute("aria-label", "Retour en haut");
  button.textContent = "\u2191";
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });

  document.body.appendChild(button);

  const onScroll = () => {
    button.style.display = window.scrollY > 300 ? "flex" : "none";
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

export function setupSmoothAnchors() {
  queryAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      if (anchor.classList.contains("skip-link")) {
        target.focus({ preventScroll: true });
      }
    });
  });
}
