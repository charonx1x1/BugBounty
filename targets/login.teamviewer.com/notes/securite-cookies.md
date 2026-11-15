# TEST-COOKIE-01 — Attributs de sécurité des cookies TeamViewer

**Cible :** `https://login.teamviewer.com`  
**Source :** réponse HTTP déjà capturée dans Burp Suite Community Edition, `POST /LogOn/Authenticate`  
**Nature :** analyse passive des en-têtes `Set-Cookie`

## Objectif

Examiner les protections déclarées des cookies émis lors d'une authentification et documenter uniquement des métadonnées, sans valeurs de cookies ni autres secrets.

## Résultats observés

| Nom du cookie | Secure | HttpOnly | SameSite explicite | Domain explicite | Path | Expiration explicite |
| --- | --- | --- | --- | --- | --- | --- |
| `.ASPXAUTH` | Oui | Oui | Strict | Non | `/` | Oui |
| `ELT` | Oui | Oui | Non | Non | `/` | Oui |
| `LogOnType` | Oui | Non | Non | Non | `/` | Non observée |
| `__xFlUD3rsEr4sd` | Oui | Oui | Non | Non | `/` | Non observée |

Les noms et attributs sont relevés dans une réponse précise, sans supposer qu'ils restent identiques pour toutes les connexions ou versions.

## Interprétation

- `Secure` est déclaré sur les quatre cookies.
- `HttpOnly` est déclaré sur trois cookies. `LogOnType` porte la valeur descriptive `StandardLogOn` dans la capture ; son absence de `HttpOnly` n'établit pas à elle seule une vulnérabilité.
- `SameSite=Strict` est explicitement défini sur `.ASPXAUTH` ; il n'est pas explicite sur les trois autres. Certains navigateurs appliquent une politique par défaut, mais son comportement effectif n'a pas été testé.
- En l'absence de `Domain`, les cookies sont normalement limités à l'hôte qui les a émis.
- L'absence de `Expires` et `Max-Age` sur deux cookies indique une durée côté navigateur liée à la session, sous réserve du comportement de restauration des sessions du navigateur.

## Verdict

**Aucune vulnérabilité confirmée dans ce contrôle.** La configuration observée offre plusieurs protections utiles. Les attributs non explicites constituent des observations et ne prouvent ni contournement d'authentification ni faille CSRF.

## Limites et suites possibles

- Une seule réponse HTTP analysée ; aucune vérification exhaustive de toutes les routes et sessions.
- Le rôle exact de chaque cookie n'est pas entièrement établi.
- Une évaluation du risque CSRF nécessite d'autres éléments que l'attribut `SameSite` seul ; un contrôle CSRF distinct du projet n'avait pas démontré de contournement.
- Conserver les preuves uniquement sous forme expurgée ; ne jamais committer les valeurs `Cookie`, `Set-Cookie`, jetons SSO, CAPTCHA ou mots de passe.
- Révoquer les sessions dont les secrets ont été exposés lors du travail.
