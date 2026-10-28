import { collection, config, fields, singleton } from "@keystatic/core";

const projectImage = {
  directory: "public/images/projects",
  publicPath: "/images/projects/",
};

const skillImage = {
  directory: "public/images/skills",
  publicPath: "/images/skills/",
};

const shortOptionalText = (label: string, max = 120) =>
  fields.text({
    label,
    validation: { length: { max } },
  });

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: { name: "Portfolio de Fenotiana Michael" },
  },
  collections: {
    projects: collection({
      label: "Projets",
      path: "src/content/projects/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "type", "featured", "draft", "order"],
      schema: {
        title: fields.slug({
          name: {
            label: "Nom du projet",
            validation: { length: { min: 1, max: 100 } },
          },
          slug: {
            label: "Slug de l’URL",
            description: "Identifiant stable utilisé dans l’URL et les relations.",
          },
        }),
        type: fields.text({
          label: "Type de projet",
          validation: { length: { min: 1, max: 100 } },
        }),
        summary: fields.text({
          label: "Résumé",
          description: "Une phrase présentant la valeur essentielle du projet (160 caractères maximum).",
          multiline: true,
          validation: { length: { min: 1, max: 160 } },
        }),
        cover: fields.object(
          {
            image: fields.image({
              label: "Image principale",
              ...projectImage,
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: "Texte alternatif",
              validation: { length: { min: 1, max: 160 } },
            }),
            width: fields.integer({ label: "Largeur", validation: { min: 1 } }),
            height: fields.integer({ label: "Hauteur", validation: { min: 1 } }),
          },
          {
            label: "Image de couverture",
            description: "Ajoutez une couverture et décrivez précisément ce qu’elle montre.",
          },
        ),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Capture",
              ...projectImage,
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: "Texte alternatif",
              validation: { length: { min: 1, max: 160 } },
            }),
            caption: fields.text({
              label: "Légende",
              validation: { length: { max: 120 } },
            }),
            width: fields.integer({ label: "Largeur", validation: { min: 1 } }),
            height: fields.integer({ label: "Hauteur", validation: { min: 1 } }),
          }),
          {
            label: "Captures d’écran",
            description: "Ajoutez plusieurs captures. Le texte alternatif est obligatoire et la légende facultative.",
            validation: { length: { max: 20 } },
            itemLabel: (props) => props.fields.caption.value || props.fields.alt.value || "Capture",
          },
        ),
        technologies: fields.array(
          fields.relationship({
            label: "Compétence",
            collection: "skills",
            validation: { isRequired: true },
          }),
          {
            label: "Technologies",
            validation: { length: { min: 1 } },
            itemLabel: (props) => props.value ?? "Sélectionner une compétence",
          },
        ),
        context: fields.text({
          label: "Contexte",
          multiline: true,
          validation: { length: { max: 600 } },
        }),
        problem: fields.text({
          label: "Problème",
          multiline: true,
          validation: { length: { min: 1, max: 400 } },
        }),
        solution: fields.array(
          fields.text({ label: "Point de solution", validation: { length: { min: 1, max: 240 } } }),
          {
            label: "Solution",
            validation: { length: { min: 1, max: 3 } },
            itemLabel: (props) => props.value || "Point de solution",
          },
        ),
        features: fields.array(
          fields.text({ label: "Fonctionnalité", validation: { length: { min: 1, max: 180 } } }),
          {
            label: "Fonctionnalités principales",
            validation: { length: { max: 6 } },
            itemLabel: (props) => props.value || "Fonctionnalité",
          },
        ),
        decisions: fields.array(
          fields.text({ label: "Décision", validation: { length: { min: 1, max: 240 } } }),
          {
            label: "Difficultés et décisions techniques",
            validation: { length: { max: 3 } },
            itemLabel: (props) => props.value || "Décision technique",
          },
        ),
        architecture: fields.text({
          label: "Architecture ou fonctionnement",
          multiline: true,
          validation: { length: { max: 600 } },
        }),
        result: fields.text({
          label: "Résultat documenté",
          multiline: true,
          validation: { length: { max: 400 } },
        }),
        role: shortOptionalText("Mon rôle"),
        duration: shortOptionalText("Durée", 80),
        status: shortOptionalText("Statut", 80),
        githubUrl: fields.url({ label: "URL du code GitHub" }),
        demoUrl: fields.url({ label: "URL de démonstration" }),
        codeNote: fields.text({
          label: "Note à propos du code",
          multiline: true,
          validation: { length: { max: 240 } },
        }),
        featured: fields.checkbox({
          label: "Mettre ce projet en avant",
          description: "Activez cette option uniquement pour les projets prioritaires.",
          defaultValue: false,
        }),
        order: fields.integer({
          label: "Ordre d’affichage",
          description: "1 apparaît en premier. Utilisez un numéro différent pour chaque projet.",
          validation: { min: 1 },
        }),
        draft: fields.checkbox({
          label: "Conserver en brouillon",
          description: "Activé : invisible sur le site public. Désactivé : le projet est publié.",
          defaultValue: true,
        }),
      },
    }),
    skills: collection({
      label: "Compétences",
      path: "src/content/skills/*",
      slugField: "name",
      format: { data: "json" },
      columns: ["name", "category", "featured", "order"],
      schema: {
        name: fields.slug({
          name: {
            label: "Nom",
            validation: { length: { min: 1, max: 80 } },
          },
          slug: {
            label: "Identifiant stable",
            description: "Ne pas modifier après avoir relié la compétence à un projet.",
          },
        }),
        category: fields.select({
          label: "Catégorie",
          options: [
            { label: "Frontend", value: "frontend" },
            { label: "Backend et API", value: "backend" },
            { label: "Mobile", value: "mobile" },
            { label: "Bases de données", value: "database" },
            { label: "IA", value: "ai" },
            { label: "Outils et protocoles", value: "tools" },
          ],
          defaultValue: "tools",
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { length: { max: 240 } },
        }),
        icon: fields.image({ label: "Icône", ...skillImage }),
        featured: fields.checkbox({ label: "Afficher parmi les compétences principales", defaultValue: false }),
        order: fields.integer({
          label: "Ordre d’affichage",
          description: "1 apparaît en premier. Utilisez un numéro différent pour chaque compétence.",
          validation: { min: 1 },
        }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: "Informations du portfolio",
      path: "src/content/site/settings",
      schema: {
        name: fields.text({ label: "Nom", defaultValue: "RAKOTOMALALA Fenotiana Michael" }),
        profession: fields.text({ label: "Métier", defaultValue: "Développeur full-stack web et mobile" }),
      },
    }),
  },
});

