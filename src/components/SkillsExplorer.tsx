import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

type SkillCategory = "frontend" | "backend" | "mobile" | "database" | "ai" | "tools";

type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  featured: boolean;
  projects: string[];
};

type Props = { skills: Skill[] };

const categoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend et API",
  mobile: "Mobile",
  database: "Bases de données",
  ai: "Intelligence artificielle",
  tools: "Outils et protocoles",
};

const categoryOrder = Object.keys(categoryLabels) as SkillCategory[];

export default function SkillsExplorer({ skills }: Props) {
  const availableCategories = categoryOrder.filter((category) =>
    skills.some((skill) => skill.category === category),
  );
  const [activeCategory, setActiveCategory] = useState<SkillCategory>(availableCategories[0] ?? "frontend");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (skills.length === 0 || availableCategories.length === 0) return null;

  const activeSkills = skills.filter((skill) => skill.category === activeCategory);
  const activeCategoryIndex = availableCategories.indexOf(activeCategory);

  const selectCategory = (index: number) => {
    const nextIndex = (index + availableCategories.length) % availableCategories.length;
    const nextCategory = availableCategories[nextIndex];
    setActiveCategory(nextCategory);
    tabRefs.current[nextIndex]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectCategory(activeCategoryIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectCategory(activeCategoryIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectCategory(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectCategory(availableCategories.length - 1);
    }
  };

  return (
    <div className="skills-explorer">
      <div className="skill-tabs" role="tablist" aria-label="Catégories de compétences">
        {availableCategories.map((category, index) => {
          const count = skills.filter((skill) => skill.category === category).length;
          const isActive = category === activeCategory;

          return (
            <button
              type="button"
              role="tab"
              id={`skill-tab-${category}`}
              aria-selected={isActive}
              aria-controls={`skill-panel-${category}`}
              tabIndex={isActive ? 0 : -1}
              ref={(element) => { tabRefs.current[index] = element; }}
              onClick={() => setActiveCategory(category)}
              onKeyDown={handleTabKeyDown}
              key={category}
            >
              <span>{categoryLabels[category]}</span>
              <small>{String(count).padStart(2, "0")}</small>
            </button>
          );
        })}
      </div>

      <div
        className="skills-panel"
        role="tabpanel"
        id={`skill-panel-${activeCategory}`}
        aria-labelledby={`skill-tab-${activeCategory}`}
        tabIndex={0}
      >
        <div className="skills-panel-heading">
          <p>{categoryLabels[activeCategory]}</p>
          <span aria-live="polite">
            {activeSkills.length} compétence{activeSkills.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="skills-category-grid" key={activeCategory}>
          {activeSkills.map((skill, index) => (
            <article
              className={`skill-detail${skill.featured ? " is-featured" : ""}`}
              style={{ "--skill-index": index } as CSSProperties}
              key={skill.id}
            >
              <div className="skill-detail-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {skill.featured && <small>Principale</small>}
              </div>
              <h3>{skill.name}</h3>
              {skill.description && <p>{skill.description}</p>}

              <div className="skill-projects">
                <h4>Projets associés</h4>
                {skill.projects.length > 0 ? (
                  <ul>
                    {skill.projects.map((project) => <li key={project}>{project}</li>)}
                  </ul>
                ) : (
                  <p>Aucun projet public associé pour le moment.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
