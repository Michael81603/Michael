import { useEffect, useRef, useState } from "react";

type Props = { projectPage?: boolean };

export default function SiteNavigation({ projectPage = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const prefix = projectPage ? "/" : "";
  const links = [
    { href: `${prefix}#presentation`, label: "À propos", homeOnly: true },
    { href: `${prefix}#projets`, label: "Projets" },
    { href: `${prefix}#competences`, label: "Compétences" },
    { href: `${prefix}#contact`, label: "Contact" },
  ].filter((link) => !projectPage || !link.homeOnly);

  useEffect(() => {
    if (!isOpen) return;

    const closeWithEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    const closeOutside = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("keydown", closeWithEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [isOpen]);

  return (
    <div className="site-navigation-shell" ref={navigationRef}>
      <nav className="main-navigation desktop-navigation" aria-label="Navigation principale">
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>

      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        ref={toggleRef}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{isOpen ? "Fermer" : "Menu"}</span>
        <span className="mobile-nav-icon" aria-hidden="true"><i /><i /></span>
      </button>

      <nav
        className={`mobile-navigation${isOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        aria-label="Navigation mobile"
        aria-hidden={!isOpen}
      >
        {links.map((link, index) => (
          <a href={link.href} tabIndex={isOpen ? 0 : -1} onClick={() => setIsOpen(false)} key={link.href}>
            <span aria-hidden="true">0{index + 1}</span>{link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
