# TeamViewer — dossier d’enquête

L’enquête porte sur la connexion à `login.teamviewer.com`, la récupération du compte, la gestion des sessions et la sauvegarde du profil. Les étapes ci-dessous relient chaque question aux fiches et aux captures correspondantes.

## 1. Périmètre et repérage

- [Fiche cible](fiche-cible.md) — périmètre, compte de test et parcours visibles.
- [Checklist de connexion](checklist-login.md) — état des vérifications.
- [Technologies et avis de sécurité](notes/technologies-login.md), [recherche dans les archives](notes/reconnaissance-wayback-machine.md) et [analyse du Referer](notes/referer-dependances.md) — indices relevés autour de la page publique. Les résultats d’archives concernent surtout le site vitrine. [Voir la figure 1](evidences/README.md#1-repérage-et-archives).

## 2. Connexion et cycle de vie du compte

- [Vue d’ensemble des parcours](notes/pistes-login.md), [réponses liées au CAPTCHA](notes/analyse-authentification-captcha.md) et [cookies avant connexion](notes/cookies-avant-connexion.md) — observations sur le formulaire public.
- [Interface après connexion](notes/cartographie-authentifiee.md) et [attributs des cookies d’authentification](notes/securite-cookies.md) — observations avec le compte de test.
- [Notification après réinitialisation](notes/notification-post-reinitialisation.md), [révocation de session](notes/gestion-sessions.md) et [cache après déconnexion](notes/cache-apres-deconnexion.md) — le courriel de récupération est documenté. La notification distincte après changement et la MFA restent indéterminées. [Voir les figures 2 et 3](evidences/README.md#2-récupération-et-session).

## 3. Sauvegarde du profil

Lire le [relevé HTTP](notes/observation-http-profil.md), puis la [comparaison des essais](evidences/comparaison-profil.md). Les essais avec jeton absent ou invalide ont renvoyé HTTP 403 avec un nom inchangé. Le contrôle positif a renvoyé HTTP 200 avec un message générique d’erreur. L’interface a affiché le changement de nom. [Voir les figures 4 à 8](evidences/README.md#3-comparaison-dans-burp).

[Fiche détaillée sur le jeton invalide](notes/essai-jeton-invalide.md)

## 4. Résultats des outils de connexion

La [fiche Arjun](notes/recherche-parametres-arjun.md) distingue les noms candidats du résultat final. La [fiche sqlmap](notes/analyse-sqlmap-rate-limiting-429.md) décrit la limitation rencontrée et ses effets sur l’interprétation. Aucun paramètre caché ni aucune injection SQL n’a été confirmé par ces essais. [Voir les figures 9 et 10](evidences/README.md#4-résultats-des-outils).

## 5. Bilan

Les observations documentent un contrôle du jeton lors de la sauvegarde du profil. Aucune vulnérabilité n’a été confirmée sur les parcours étudiés. Le [bilan des vérifications](notes/cookies-et-bilan.md) précise la portée des observations sur les cookies et le profil.

[Journal de bord](notes/journal.md) · [Prochaines vérifications](notes/prochaines-etapes.md) · [Exercice Burp sur une réponse fictive](notes/exercice-response-manipulation.md)

[Voir toutes les captures dans l’ordre](evidences/README.md)
