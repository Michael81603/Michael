# Validation de la Phase 11

Date : 28 octobre 2026

## Données dynamiques

- ajout d’un cinquième projet dans une copie isolée : carte et page générées automatiquement ;
- modification temporaire de la compétence React : contenu affiché automatiquement ;
- passage du projet de test en brouillon : retrait confirmé de l’accueil, de sa route et du sitemap ;
- aucune donnée de test n’a été conservée dans les collections réelles.

## Vérifications techniques

- `astro check` : 0 erreur, 0 avertissement, 0 indication ;
- build Astro : accueil et quatre études de cas générés ;
- liens et fragments locaux : valides dans les dix fichiers HTML du build ;
- console JavaScript et réseau : aucune erreur ;
- responsive : validé à 1440, 768, 390 et 320 px, sans débordement horizontal ;
- clavier : lien d’évitement, carrousel, menu mobile et galerie validés ;
- images : aucune image cassée ;
- contrôles principaux : taille minimale de 44 px ;
- SEO : un H1 par page, métadonnées et données structurées générées avec une URL de test ;
- build total mesuré avant remplacement : environ 2,4 Mo.

## Remplacement et restauration

L’ancienne version est conservée dans `archive/portfolio-v1/` et par le tag Git
`baseline-static-2026-10-27`. Les anciennes URL de projet disposent de pages de redirection
statiques vers les nouvelles routes `/projets/<slug>/`.

Le déploiement public reste suspendu jusqu’à la fourniture de l’URL publique et de la cible
d’hébergement. Sans `PUBLIC_SITE_URL`, le site généré reste volontairement en `noindex`.

## Nettoyage après validation

- `archive/portfolio-v1/` : ancienne version complète, conservée pour restauration ;
- les maquettes `design/` et l’ancien profil Chrome `_chrome_profile2/` ont été supprimés ;
- six variantes d’images de cartes non référencées ont été supprimées ;
- le fichier temporaire de référence de l’ancien `.gitignore` a été supprimé.

Les sources actives, la documentation utile et la sauvegarde statique ont été conservées.
