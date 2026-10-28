import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

type GalleryImage = {
  image: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

type Props = { images: GalleryImage[]; projectTitle: string };

const wrap = (index: number, length: number) => (index + length) % length;

export default function CaseGallery({ images, projectTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openerIndexRef = useRef(0);

  if (images.length === 0) return null;

  const openImage = (index: number) => {
    openerIndexRef.current = index;
    setActiveIndex(index);
    setIsOpen(true);
    dialogRef.current?.showModal();
    document.documentElement.classList.add("has-modal");
    requestAnimationFrame(() => closeRef.current?.focus());
  };

  const closeGallery = () => dialogRef.current?.close();
  const move = (direction: number) => setActiveIndex((index) => wrap(index + direction, images.length));

  const handleDialogClose = () => {
    setIsOpen(false);
    document.documentElement.classList.remove("has-modal");
    triggerRefs.current[openerIndexRef.current]?.focus();
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeGallery();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeGallery();
  };

  const activeImage = images[activeIndex];

  return (
    <>
      <div className="case-gallery">
        {images.map((image, index) => (
          <figure className={`case-gallery-item${index === 0 ? " case-gallery-item-wide" : ""}`} key={image.image}>
            <button
              className="case-gallery-trigger"
              type="button"
              aria-label={`Agrandir : ${image.alt}`}
              ref={(element) => { triggerRefs.current[index] = element; }}
              onClick={() => openImage(index)}
            >
              <img
                src={image.image}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
              <span aria-hidden="true">Agrandir ↗</span>
            </button>
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <dialog
        className="case-lightbox"
        ref={dialogRef}
        aria-label={`Galerie de ${projectTitle}`}
        onClose={handleDialogClose}
        onCancel={(event) => { event.preventDefault(); closeGallery(); }}
        onKeyDown={handleDialogKeyDown}
        onClick={handleBackdropClick}
      >
        {isOpen && (
          <div className="case-lightbox-panel">
            <header>
              <p aria-live="polite">Image {activeIndex + 1} sur {images.length}</p>
              <button type="button" ref={closeRef} onClick={closeGallery} aria-label="Fermer la galerie">Fermer ×</button>
            </header>
            <figure>
              <img
                src={activeImage.image}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                decoding="async"
              />
              {activeImage.caption && <figcaption>{activeImage.caption}</figcaption>}
            </figure>
            {images.length > 1 && (
              <nav aria-label="Navigation dans la galerie">
                <button type="button" onClick={() => move(-1)} aria-label="Afficher l’image précédente">← Précédente</button>
                <button type="button" onClick={() => move(1)} aria-label="Afficher l’image suivante">Suivante →</button>
              </nav>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
