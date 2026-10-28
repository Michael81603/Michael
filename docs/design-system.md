# Système graphique du portfolio V2

## Direction

Le portfolio associe une présentation éditoriale à une profondeur numérique sobre : fond beige chaud,
bleu nuit, saumon sombre, grands titres, composition asymétrique, captures réelles et signature `F/M`.

## Source de référence

Toutes les fondations visuelles se trouvent dans `src/styles/tokens.css` :

- couleurs et contrastes ;
- familles, tailles, interlignages et approches typographiques ;
- échelle d'espacement ;
- dimensions partagées et largeur maximale ;
- rayons, bordures et ombres ;
- focus clavier ;
- durées, courbes et distances de mouvement.

Un composant ne doit pas déclarer une nouvelle couleur, une nouvelle ombre ou une nouvelle courbe
d'animation directement. Si une nouvelle valeur est réellement nécessaire à plusieurs composants,
elle doit d'abord être ajoutée comme token, puis utilisée par son nom sémantique.

## Principes de composants

- Une action importante utilise une hauteur minimale de 44 px.
- Le bouton principal utilise le bleu nuit ; le saumon sombre sert aux accents et aux états actifs.
- Les titres éditoriaux utilisent la famille d'affichage, les textes fonctionnels la famille sans serif.
- Les captures sont affichées dans des surfaces claires avec des rayons et ombres communs.
- Le focus ne dépend jamais uniquement d'un changement de couleur.
- Les transitions restent courtes et sont neutralisées avec `prefers-reduced-motion`.

## Ajout d'un composant

1. Réutiliser les tokens existants.
2. Vérifier les états repos, survol, focus et désactivé lorsqu'ils existent.
3. Tester à 1440, 768, 390 et 320 px.
4. Vérifier le contraste et l'absence de débordement horizontal.
