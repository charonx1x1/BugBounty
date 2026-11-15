# Observation HTTP — modification du profil

Cette note décrit le relevé initial dans Safari. Pour le résultat ultérieur du contrôle serveur, voir [la comparaison dans Burp](essai-jeton-invalide.md#comparaison-manuelle-dans-burp-repeater).

## Conditions

Compte de test A gratuit, Safari, inspecteur réseau intégré. Une soumission du formulaire de connexion avec les champs remplis a conduit à `/nav/home`. Un écran de vérification automatique anti-robot est apparu puis a redirigé vers la console. La valeur du mot de passe masqué n’a pas été lue ; cette observation atteste l’accès obtenu, pas un test isolé de l’ancien et du nouveau mot de passe.

## Action normale observée

Le nom du profil a été changé de « Projet test » en « Projet test A » avec le formulaire normal. Le nouveau nom était visible dans le menu du compte puis dans le formulaire rouvert. Le nom initial « Projet test » a ensuite été rétabli et observé dans le menu du compte.

## Requête observée dans Safari

| Élément | Observation |
| --- | --- |
| Méthode et chemin | `POST /UserManagement/UpdateProfile` |
| Domaine | `login.teamviewer.com` |
| Type du corps | `application/json; charset=utf-8` |
| En-tête personnalisé | `__xFlUD3rsEr4sd` présent ; valeur volontairement omise |
| Origin | `https://login.teamviewer.com` |
| Referer | `https://login.teamviewer.com/nav/profile/general` |
| X-Requested-With | `XMLHttpRequest` |
| Sec-Fetch-Site | `same-origin` |
| Cookies | Présents ; valeurs non conservées |
| Statut HTTP | `200` |
| Cache-Control de la réponse | `no-cache, no-store, must-revalidate, private` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Strict-Transport-Security | `max-age=31536000` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `SAMEORIGIN` |

L’aperçu de la réponse affichait aussi un objet comportant `s: 1` et le texte « Une erreur non spécifiée est survenue. ». Le nom modifié était pourtant visible dans l’interface et à la réouverture du profil. La signification de ces champs n’est pas établie ; un statut HTTP 200 ne suffit pas à qualifier un résultat applicatif.

La sauvegarde a également déclenché une requête nommée `SetTrustDeviceViaPush`. Aucun réglage de confiance n’a été volontairement modifié ; le contenu et l’effet de cette requête n’ont pas été vérifiés. Ne pas déduire de son seul nom un changement de sécurité.

## Interprétation pour CWE-352

L’en-tête personnalisé peut participer à une protection anti-CSRF, mais sa fonction et sa validation ne sont pas démontrées. Aucun essai avec suppression ou altération de cet en-tête, ni aucune requête provenant d’une autre origine, n’a été effectué. Le type JSON, les cookies et les en-têtes observés doivent être analysés ensemble. Aucune vulnérabilité CSRF confirmée.

## Preuves et limites

Relevé manuel de l’inspecteur Safari ; aucun HAR brut exporté. Capture locale de l’état final : `outputs/profil-nom-retabli.png` dans le dossier de travail. Les attributs des cookies, le corps exact de la requête et les contrôles serveur restent à étudier. Les valeurs des secrets sont exclues de cette note.
