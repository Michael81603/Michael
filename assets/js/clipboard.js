let toastElement = null;
let toastTimer = null;

function ensureToast() {
  if (toastElement) return toastElement;

  toastElement = document.createElement("div");
  toastElement.className = "toast";
  toastElement.setAttribute("role", "status");
  toastElement.setAttribute("aria-live", "polite");
  document.body.appendChild(toastElement);

  return toastElement;
}

function showToast(message) {
  const element = ensureToast();
  element.textContent = message;
  element.classList.add("toast-show");

  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    element.classList.remove("toast-show");
  }, 1500);
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

    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export function setupClipboard() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      const copied = await copyText(value);
      button.focus();
      showToast(copied ? "Copie effectuée" : "Impossible de copier");
    });
  });
}
