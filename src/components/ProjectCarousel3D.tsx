import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

type Project = {
  id: string;
  title: string;
  type: string;
  summary: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  technologies: string[];
};

type Props = { projects: Project[] };

type OrbitStyle = CSSProperties & {
  "--orbit-x": string;
  "--orbit-z": string;
  "--orbit-angle": string;
  "--orbit-scale": number;
  "--orbit-opacity": number;
  "--orbit-layer": number;
};

const wrap = (index: number, length: number) => (index + length) % length;

const getSignedDistance = (index: number, activeIndex: number, length: number) => {
  const forward = wrap(index - activeIndex, length);
  return forward > length / 2 ? forward - length : forward;
};

const getOrbitStyle = (distance: number, total: number): OrbitStyle => {
  const depth = Math.abs(distance);
  const direction = Math.sign(distance);
  const horizontal = depth === 0 ? 0 : direction * (depth === 1 ? 62 : 96 + (depth - 2) * 14);
  const translateZ = depth === 0 ? 0 : depth === 1 ? -170 : -330 - (depth - 2) * 80;
  const angle = depth === 0 ? 0 : direction * (depth === 1 ? -17 : -25);
  const scale = depth === 0 ? 1 : depth === 1 ? 0.82 : Math.max(0.52, 0.68 - (depth - 2) * 0.07);
  const opacity = depth === 0 ? 1 : depth === 1 ? 0.78 : Math.max(0.24, 0.52 - (depth - 2) * 0.1);

  return {
    "--orbit-x": `${horizontal}%`,
    "--orbit-z": `${translateZ}px`,
    "--orbit-angle": `${angle}deg`,
    "--orbit-scale": scale,
    "--orbit-opacity": opacity,
    "--orbit-layer": total - depth,
  };
};

export default function ProjectCarousel3D({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef<{ id: number; x: number } | null>(null);
  const suppressImageNavigation = useRef(false);

  if (projects.length === 0) return null;

  const selectProject = (index: number) => {
    setActiveIndex(wrap(index, projects.length));
    setDragOffset(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectProject(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectProject(activeIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectProject(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectProject(projects.length - 1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, .orbit-project-link")) return;
    suppressImageNavigation.current = false;
    pointerStart.current = { id: event.pointerId, x: event.clientX };
    setIsDragging(false);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current || pointerStart.current.id !== event.pointerId) return;
    const distance = event.clientX - pointerStart.current.x;
    if (Math.abs(distance) > 4 && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    setDragOffset(Math.max(-140, Math.min(140, distance)));
  };

  const finishPointerGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current || pointerStart.current.id !== event.pointerId) return;
    const distance = event.clientX - pointerStart.current.x;
    pointerStart.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(distance) >= 45) {
      suppressImageNavigation.current = true;
      globalThis.setTimeout(() => { suppressImageNavigation.current = false; }, 0);
      selectProject(activeIndex + (distance < 0 ? 1 : -1));
    }
  };

  const handleCardLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!suppressImageNavigation.current) return;
    event.preventDefault();
    suppressImageNavigation.current = false;
  };

  const activeProject = projects[activeIndex];

  return (
    <div className="project-orbit">
      <div className="orbit-toolbar">
        <p className="orbit-counter" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          Projet actif : {activeProject.title}. Projet {activeIndex + 1} sur {projects.length}.
        </p>
        <div className="orbit-controls">
          <button
            type="button"
            onClick={() => selectProject(activeIndex - 1)}
            aria-label="Afficher le projet précédent"
            disabled={projects.length < 2}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => selectProject(activeIndex + 1)}
            aria-label="Afficher le projet suivant"
            disabled={projects.length < 2}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <p className="orbit-instructions" id="orbit-instructions">
        Utilisez les flèches, les touches gauche et droite, ou faites glisser les cartes.
      </p>

      <div
        className={`orbit-stage${isDragging ? " is-dragging" : ""}`}
        style={{ "--drag-x": `${dragOffset}px` } as CSSProperties}
        tabIndex={0}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Projets du portfolio"
        aria-describedby="orbit-instructions"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={finishPointerGesture}
      >
        {projects.map((project, index) => {
          const distance = getSignedDistance(index, activeIndex, projects.length);
          const isActive = index === activeIndex;

          return (
            <article
              className="project-orbit-card"
              data-depth={Math.min(Math.abs(distance), 2)}
              data-side={Math.sign(distance)}
              aria-current={isActive ? "true" : undefined}
              style={getOrbitStyle(distance, projects.length)}
              key={project.id}
            >
              {isActive ? (
                <a
                  className="orbit-card-open"
                  href={`/projets/${project.id}/`}
                  aria-label={`Voir l’étude de cas « ${project.title} »`}
                  draggable="false"
                  onClick={handleCardLinkClick}
                />
              ) : (
                <button
                  className="orbit-card-select"
                  type="button"
                  onClick={() => selectProject(index)}
                  aria-label={`Placer le projet « ${project.title} » au centre`}
                />
              )}
              <div
                className="orbit-media"
                style={{ viewTransitionName: isActive ? `project-${project.id}` : "none" }}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  width={project.width}
                  height={project.height}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="orbit-copy">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="orbit-description">{project.summary}</p>
                <ul className="orbit-technologies" aria-label={`Technologies de ${project.title}`}>
                  {project.technologies.slice(0, 5).map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
                {isActive && (
                  <span className="orbit-project-link" aria-hidden="true">
                    Voir l’étude de cas <span aria-hidden="true">→</span>
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
