import { setupBackToTop, setupSmoothAnchors } from "./navigation.js";
import { setupClipboard } from "./clipboard.js";
import { setupLightbox } from "./lightbox.js";

function initialize() {
  setupBackToTop();
  setupSmoothAnchors();
  setupClipboard();
  setupLightbox();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
