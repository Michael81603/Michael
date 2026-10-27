# Point de référence avant la migration

Date de validation : 27 octobre 2026

Ce document décrit la version statique conservée avant la migration vers Astro, React et Keystatic. Aucun fichier d'origine ou d'archive ne doit être supprimé sans validation explicite.

## Pages conservées

- `index.html` : page d'accueil publique.
- `projects/realizen-ai.html` : étude de cas RealiZen-AI.
- `projects/deliverpro.html` : étude de cas DeliverPro.
- `projects/pizzamama.html` : étude de cas Pizzamama.
- `projects/gestion-revenus.html` : étude de cas Gestion des revenus et dépenses.
- `contact-frame.html` : page technique de contact, exclue de l'indexation.
- `design/prototype/index.html` : prototype visuel de référence, non destiné à l'indexation.

## Réorganisation réalisée

| Ancien emplacement | Nouvel emplacement ou rôle |
| --- | --- |
| `styles.css` | Règles réparties entre `assets/css/base.css`, `assets/css/components.css` et `assets/css/pages.css` |
| `app.js` | Fonctions réparties entre `assets/js/main.js`, `assets/js/navigation.js`, `assets/js/lightbox.js` et `assets/js/clipboard.js` |
| `portfolio-realizen-ai.html` | `projects/realizen-ai.html` |
| `portfolio-deliverpro.html` | `projects/deliverpro.html` |
| `portfolio-site-restaurant.html` | `projects/pizzamama.html` |
| `portfolio-site-gestion-revenu.html` | `projects/gestion-revenus.html` |
| Images de profil et de fond à la racine | `assets/images/profile/` |
| Captures de RealiZen-AI | `assets/images/projects/realizen-ai/` |
| Captures de DeliverPro | `assets/images/projects/deliverpro/` |
| Captures de Pizzamama | `assets/images/projects/pizzamama/` |
| Captures de gestion des revenus | `assets/images/projects/gestion-revenus/` |
| Icônes réutilisées | `assets/icons/` |

Les images de production disposent, selon leur usage, de versions WebP et de variantes plus petites pour les cartes. Les originaux sont conservés pour permettre une nouvelle conversion sans perte.

## Archives conservées

Le dossier `assets/images/archive/` contient des ressources historiques qui ne sont pas nécessaires au rendu public actuel, mais qui peuvent servir de référence :

- `archive/deliverpro/` : anciennes illustrations SVG des écrans DeliverPro ;
- `archive/pizzamama/` : anciennes captures générales du projet Pizzamama ;
- `archive/site/` : formes, fonds et images utilisés par les anciennes versions du portfolio.

Le dossier `design/` contient les maquettes et captures de conception :

- concepts générés en image ;
- captures du prototype codé en formats ordinateur et mobile ;
- prototype HTML/CSS éditorial.

Le dossier `_chrome_profile2/` est un ancien profil de test Chrome déjà suivi par Git. Il n'est pas requis par le site ; sa suppression éventuelle reste différée jusqu'à validation explicite.

## Vérifications effectuées

- tous les chemins locaux référencés par les pages existent ;
- toutes les pages répondent avec le statut HTTP 200 sur le serveur local ;
- l'accueil et les quatre études de cas possèdent exactement un `h1` ;
- toutes les pages possèdent un élément `main` et un `footer` ;
- les quatre modules JavaScript passent `node --check` ;
- l'accueil a été vérifié visuellement à 1440 px et 390 px ;
- l'étude de cas RealiZen-AI a été vérifiée visuellement à 1280 px ;
- les versions originales et optimisées des images sont conservées.

## Limites connues conservées

- plusieurs informations personnelles et professionnelles restent marquées `TODO` ;
- plusieurs études de cas contiennent encore « Information à compléter » ;
- les métadonnées SEO complètes, `robots.txt` et `sitemap.xml` ne sont pas encore créés, car l'URL publique n'est pas renseignée ;
- le prototype visuel ne remplace pas encore le site public ;
- le contenu reste statique : Astro, React et Keystatic ne sont pas encore installés.

Ce point de référence doit rester récupérable pendant toute la migration.
