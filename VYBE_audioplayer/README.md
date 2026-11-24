# VYBE — déploiement statique (sans compilation)

Dossier prêt à l'emploi : 15 fichiers à la racine, aucun sous-dossier.
Ce n'est pas une compilation Vite : c'est la même application, déjà assemblée (esbuild, minifiée).
Pour modifier le code, utilise le projet complet (`VYBE_projet_final.zip`).

## Fichiers
index.html · app.js · app.css · theme-init.js · sw.js · manifest.webmanifest · favicon.png · vybe-logo.png (logo d'origine, inchangé) ·
icon-192.png · icon-512.png · icon-maskable-512.png · apple-touch-icon.png · robots.txt · vercel.json · README.md

## Déployer sur Vercel depuis un téléphone
1. Crée un dépôt GitHub (github.com → New repository).
2. Dans le dépôt : « Add file » → « Upload files », sélectionne les 15 fichiers, puis « Commit changes ».
3. Sur vercel.com → « Add New… » → « Project » → importe ce dépôt.
4. Réglages : Framework Preset « Other » ; laisse Build Command et Output Directory vides ; « Deploy ».
5. Ouvre l'adresse fournie : VYBE s'affiche.

## Installer et utiliser hors ligne
Ouvre l'adresse une première fois en ligne, puis dans Chrome Android : menu ⋮ → « Installer l'application ».
Ensuite VYBE s'ouvre comme une application, même sans réseau. Tes musiques et vidéos restent sur ton appareil
(stockage du navigateur) : rien n'est envoyé sur le serveur.
