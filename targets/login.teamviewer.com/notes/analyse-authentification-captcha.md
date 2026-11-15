# TEST-AUTH-CAPTCHA-01 — Analyse passive des réponses d'authentification

**Cible :** `https://login.teamviewer.com`  
**Méthode :** comparaison de réponses déjà observées dans Burp Suite Community Edition  
**État :** non concluant — aucune vulnérabilité démontrée

## Objectif

Documenter les résultats applicatifs d'une tentative d'authentification rejetée, d'une demande de confirmation d'appareil de confiance et d'une réponse de succès apparent. Évaluer uniquement ce que les captures permettent d'affirmer à propos du CAPTCHA et du jeton SSO.

## Éléments observés

| Élément | Observation | Portée de la preuve |
| --- | --- | --- |
| Route | `POST /LogOn/Authenticate` | Le serveur traite le formulaire de connexion |
| Réponse A | HTTP `200`, JSON contenant `"s":0`, `"e":5`, `"c":true` | Rejet d'une tentative dont les identifiants ne correspondent pas |
| Message A | « Le nom d'utilisateur et le mot de passe que vous avez saisis ne correspondent à aucun compte enregistré. » | Message explicite de rejet |
| Réponse B (capture antérieure) | JSON avec `"s":0`, `"e":10`, `"c":true` | Message demandant la confirmation du navigateur comme appareil de confiance |
| Réponse C (capture antérieure) | HTTP `200`, JSON `{"s":1}` | Succès applicatif apparent ; ne garantit pas, isolément, l'accès à tous les services |
| Requête de la réponse A | Champs `ssoVerificationToken` et `invisiblecaptcha-response` présents | Présence de valeurs transmises, non preuve de leur validation |

**Remarque :** `"c":true` est présent dans les échecs observés, mais sa signification interne n'est pas établie. Les codes `e:5` et `e:10` sont des codes applicatifs observés, non une documentation officielle de leur sémantique.

## Interprétation

1. Le statut HTTP `200` indique le traitement HTTP, pas nécessairement une authentification réussie : dans la réponse A, `"s":0` signale un échec applicatif.
2. L'échec `e:5` et la demande de confiance de l'appareil `e:10` correspondent à deux situations différentes. Les réponses ne permettent pas de déduire l'ordre exact des contrôles.
3. La présence de `invisiblecaptcha-response` n'établit pas que le CAPTCHA ait été accepté : le serveur peut rejeter la demande à une autre étape.
4. La présence de `ssoVerificationToken` n'établit pas non plus que sa validation ait réussi.
5. Les captures ne démontrent ni contournement du CAPTCHA ou du SSO, ni vulnérabilité d'énumération de comptes.

## Verdict et limites

**Aucune vulnérabilité confirmée.** Il n'est pas possible d'établir l'ordre de validation du CAPTCHA, du mot de passe, du jeton SSO et de la confiance de l'appareil sans informations supplémentaires provenant d'un environnement de test autorisé ou du serveur.

La comparaison repose sur des requêtes historiques de contextes différents, potentiellement avec des sessions et CAPTCHA distincts. Aucune nouvelle requête n'a été envoyée pour ce contrôle documentaire.

## Gestion des preuves

- Ne conserver que les codes HTTP, les noms des champs et les messages d'erreur non sensibles.
- Ne pas publier les valeurs de `Cookie`, `Set-Cookie`, `Password`, `ssoVerificationToken`, `invisiblecaptcha-response` ni de jetons anti-bot.
- Révoquer les sessions et renouveler les identifiants précédemment exposés lorsque cela s'applique.
- Ne réaliser des tests actifs supplémentaires que sur un environnement et selon un périmètre explicitement autorisés.

## Observation complémentaire — Rejet explicite du CAPTCHA

Dans une autre réponse déjà capturée, la route `POST /LogOn/Authenticate` renvoie **HTTP 200** avec `"s":0`, un champ `err.CaptchaError` et le message « Cochez la case pour prouver que vous êtes un être humain. » Le champ `"c":true` est également présent, sans signification interne établie.

**Interprétation :** cette tentative a été rejetée avec un motif lié au CAPTCHA. La présence d'un jeton dans la requête ne démontre pas sa validation. Cette réponse ne prouve ni l'ordre dans lequel le serveur effectue ses vérifications, ni un contournement du CAPTCHA, du SSO ou des identifiants.

**Verdict complémentaire :** aucune vulnérabilité démontrée. Cette observation provient des captures déjà collectées ; aucun nouveau test actif n'a été effectué pour la documenter. Les valeurs de cookies, jetons et identifiants sont volontairement exclues.
