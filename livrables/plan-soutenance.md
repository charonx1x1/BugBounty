# Plan de soutenance — proposition à répartir dans le groupe

Trame de 15 minutes, dont les 5 dernières consacrées à l’IA, suivies des questions. Ce document prépare les diapositives ; ce n’est pas un fichier PowerPoint final. La partie TeamViewer doit être combinée avec les résultats des autres membres.

| Temps | Support | Message et preuve à présenter |
| --- | --- | --- |
| 0:00–1:00 | Programme et périmètre | Pourquoi cette console ; compte de test ; limites du programme. Une seule vue du périmètre. |
| 1:00–2:30 | Méthode et choix | Authentification et CSRF ; observation, hypothèse, comparaison, vérification de l’effet. |
| 2:30–5:00 | Résultat principal | Tableau jeton valide/invalide/absent. Montrer seulement les réponses expurgées et le nom avant/après. |
| 5:00–6:30 | Authentification et sessions | Flux normal observé ; usage unique du lien indéterminé. Note de sessions seulement si ses preuves sont retrouvées. |
| 6:30–8:00 | Impact et recommandations | Pas de vulnérabilité confirmée ; portée limitée du contrôle ; nettoyage et qualité des preuves. |
| 8:00–10:00 | Difficultés et enseignements | Substitution Safari non concluante ; message JSON ambigu ; importance du contrôle positif. Intégrer les difficultés des autres membres. |
| 10:00–12:00 | IA dans notre travail | Aide à la structuration et aux étapes ; limites de l’interface ; interprétations corrigées grâce aux observations. |
| 12:00–15:00 | Évolution du métier | Automatisation de tâches répétitives, revue humaine du périmètre et de l’impact ; injection de prompt comme surface à discuter, non testée sur cette cible. |

## Diapositive — Protections du formulaire de connexion

À intégrer au créneau « Méthode et choix » (45 secondes).

- **Safari, HTTP 200** — HSTS, CSP et X-Frame-Options: SAMEORIGIN observés sur /LogOn.
- **CSP complète** — form-action, base-uri et frame-ancestors absentes de la politique capturée. SAMEORIGIN est présent dans un en-tête distinct.
- **Avant saisie** — 42 requêtes HTTPS observées, dont deux POST vers reCAPTCHA (401 puis 200). Aucun POST vers la console dans ce segment.
- **Verdict** — configuration documentée. Aucune fuite ni vulnérabilité démontrée. La cause du 403 obtenu en accès direct reste inconnue.

À l’oral : « On a distingué la page réellement affichée dans Safari de la réponse de refus obtenue en accès direct avant d’attribuer les en-têtes au formulaire. »

## Fil conducteur oral

« Notre objectif était d’évaluer des parcours précis avec un compte maîtrisé. Nous n’avons pas démontré de faille. Notre résultat le plus solide est une comparaison : le jeton valide permet la modification, une valeur invalide ou l’absence de l’en-tête la fait rejeter. Nous avons contrôlé le nom réellement affiché, car le JSON de la réponse positive contenait paradoxalement un message d’erreur. »

## Questions à préparer

- Pourquoi HTTP 200 ne suffit-il pas ? Il faut vérifier l’état métier ; ici le nom a servi de témoin.
- Pourquoi un HTTP 403 ne suffit-il pas ? Une session expirée ou une requête mal formée pourrait aussi provoquer un refus ; le contrôle positif réduit cette ambiguïté.
- Est-ce la preuve que TeamViewer n’a aucune CSRF ? Non, une seule action et quelques variantes ont été étudiées.
- Le lien de récupération réutilisé est-il une faille ? Non : le formulaire a été affiché, sans nouvelle soumission du secret.
- Quelle est la valeur d’un résultat négatif ? Un protocole traçable documente une défense et les limites de couverture, conformément au sujet.
- Quel a été le rôle de l’IA ? Aide aux manipulations et à la rédaction ; conclusions confrontées aux réponses et aux captures, limites explicitement conservées.

## Préparation finale

Répartir les temps entre membres, intégrer les autres cibles, vérifier les règles du programme et répéter au chronomètre. Préférer une démonstration enregistrée ou des preuves expurgées à une modification en direct pendant l’oral. Aucun cookie, jeton ou mot de passe ne doit apparaître sur les supports. Ne pas présenter le nettoyage final comme terminé sans confirmation.

## Démonstration sur preuves — 60 secondes

- **0–20 s** — Montrer le statut 200 et le message générique, puis l’état visible du profil. La réponse seule laissait le résultat ambigu.
- **20–40 s** — Montrer les deux 403 et le nom inchangé. Présenter le contrôle positif suivant pour expliquer pourquoi une session expirée explique mal le second refus.
- **40–60 s** — Formuler le verdict : rejet observé pour les deux variantes sur la sauvegarde du profil. La portée s’arrête aux cas observés.

[Tableau des preuves à projeter](registre-preuves-login.md#http-03-à-http-06--effet-sur-le-profil)
