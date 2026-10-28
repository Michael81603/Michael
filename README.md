# Portfolio de Fenotiana Michael

Portfolio construit avec Astro, TypeScript, React, Keystatic et du CSS personnalisé.

## Commandes

```sh
npm install
npm run dev
```

- Site local : `http://127.0.0.1:4321/`
- Administration Keystatic : `http://127.0.0.1:4321/keystatic`

L’ancienne version statique est conservée dans `archive/portfolio-v1/`. Le tag Git
`baseline-static-2026-10-27` permet également de revenir au point de référence antérieur à la migration.

Keystatic fonctionne actuellement en mode local. Il est actif avec `npm run dev` et volontairement exclu du build statique tant que l'hébergeur et l'adaptateur serveur ne sont pas choisis.

## Administration

L'accueil de la V2 fournit des accès directs pour ajouter ou modifier un projet, ajouter une compétence,
réorganiser les projets et gérer leur publication. Dans Keystatic :

- le champ « Ordre d'affichage » contrôle la position d'un projet ;
- le champ « Conserver en brouillon » masque le projet sur le site public lorsqu'il est activé ;
- chaque image possède un texte alternatif obligatoire et une légende facultative ;
- les technologies d'un projet sont sélectionnées dans la collection des compétences.

## Système graphique

Les fondations de l'identité visuelle sont centralisées dans `src/styles/tokens.css`. Les composants
utilisent ces variables pour les couleurs, typographies, espacements, rayons, ombres, largeurs,
états de focus et mouvements. Le contrat d'utilisation est documenté dans `docs/design-system.md`.

## Accueil public

La page d'accueil suit le parcours navigation, hero, présentation, projets, compétences, contact et footer.
Les projets et compétences proviennent des collections Astro. Le composant React `ProjectCarousel3D`
calcule une orbite pour chaque projet et prend en charge les boutons précédent/suivant, le clic sur une carte
latérale, le glissement à la souris, le balayage tactile, la boucle circulaire et les flèches du clavier.

La localisation, la disponibilité, LinkedIn et le CV restent masqués tant que leurs valeurs ne sont pas renseignées.

La section des compétences est générée par le composant React `SkillsExplorer`. Les catégories viennent
du schéma Keystatic et les projets associés sont calculés depuis les relations entre projets et compétences.

Les études de cas sont générées par le gabarit dynamique `src/pages/projets/[slug].astro`. Chaque projet
publié produit automatiquement une URL `/projets/<slug>/` et rejoint la navigation vers le projet suivant.

## SEO et indexation

Copiez `.env.example` vers `.env` et renseignez `PUBLIC_SITE_URL` avec le domaine définitif avant la mise
en ligne. Sans cette valeur, le build reste volontairement en `noindex` et `robots.txt` bloque les robots.
Une fois l’URL renseignée, les canonicals, Open Graph, Twitter Card, JSON-LD, `robots.txt` et `sitemap.xml`
sont générés automatiquement pour l’accueil et tous les projets publiés.

L’image sociale principale peut être régénérée avec `npm run generate:social`.
