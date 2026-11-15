# Cookies et bilan des vérifications

## Relevé dans Safari

Lecture du panneau Stockage > Cookies pour `login.teamviewer.com`, avec le compte A connecté. Aucun cookie modifié ou supprimé. Les valeurs sont exclues de ce document.

| Nom | Domaine affiché | Chemin | Durée affichée | Secure | HttpOnly | SameSite affiché |
| --- | --- | --- | --- | --- | --- | --- |
| `.ASPXAUTH` | `login.teamviewer.com` | `/` | Session | Oui | Oui | Strict |
| `__xFlUD3rsEr4sd` | `login.teamviewer.com` | `/` | Session | Oui | Oui | — |
| `__Secure-CDNCID` | `login.teamviewer.com` | `/` | Échéance explicite | Oui | Oui | Lax |

Le nom `.ASPXAUTH` suggère un rôle d’authentification ; ce rôle n’a pas été isolé par suppression du cookie. Le nom `__xFlUD3rsEr4sd` correspond à celui de l’en-tête observé lors de la sauvegarde du profil, sans preuve de la relation de validation entre leurs valeurs. « — » est le libellé de Safari, pas une preuve de `SameSite=None`. Le tableau ne permet pas à lui seul de déterminer si Domain était explicitement défini à la création du cookie.

## Portée des protections

Secure limite la transmission du cookie à HTTPS ; HttpOnly empêche sa lecture via les API JavaScript habituelles, mais ne bloque pas l’envoi du cookie par les requêtes JavaScript. SameSite=Strict limite son envoi aux requêtes provenant du même site. « Même site » ne signifie pas « même origine ». Ces propriétés constituent des défenses observées, pas une preuve générale d’absence de CSRF ou de XSS. Référence : [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie).

## Bilan utilisable dans le rapport

| Vérification | Résultat observé | Conclusion et limite |
| --- | --- | --- |
| Inscription et activation | E-mail reçu, activation confirmée | Flux normal fonctionnel ; contournement non testé |
| Demande de récupération | CAPTCHA validé, demande acceptée, e-mail reçu | Fonctionnement normal ; protection anti-robot côté serveur non isolée |
| Nouveau mot de passe | Confirmation de succès après validation par l’utilisateur | Réinitialisation confirmée par l’interface |
| Réouverture du lien utilisé | Formulaire de nouveau mot de passe affiché | Usage unique indéterminé sans nouvelle soumission |
| Connexion ultérieure | Accès à la console après soumission du formulaire | Mot de passe masqué non lu ; ancien/nouveau non comparés isolément |
| Modification du nom | Nom modifié puis rétabli | Requête normale observée, pas un test CSRF |
| Requête du profil | Jeton d’origine : HTTP 200 et nom modifié ; jeton invalide ou absent : HTTP 403 et nom inchangé | Contrôle du jeton observé dans ce scénario ; aucune exploitation inter-origines démontrée |
| Cookies | Attributs ci-dessus relevés | Défenses présentes ; aucun contournement démontré |

Les premiers essais Safari étaient non concluants. La [comparaison manuelle ultérieure dans Burp](essai-jeton-invalide.md#comparaison-manuelle-dans-burp-repeater) montre un rejet de la valeur invalide ; ses limites sont détaillées dans la fiche.

Aucune vulnérabilité confirmée. Aucun score CVSS ni impact business de compromission ne peut être attribué à ces seuls constats.

## Suite ciblée

Intégrer ce contrôle et ses limites au rapport. Un seul scénario a été vérifié sur la sauvegarde du profil ; il ne permet pas de généraliser aux autres actions. Les contrôles entre comptes et les scénarios depuis une origine tierce restent non réalisés. Toute suite devra correspondre à un objectif distinct, rester dans le périmètre et tenir compte des exclusions du programme.

## Dernier état observé

Après le contrôle positif final, le compte affiche « Projet test A ». Le rétablissement du nom initial et la déconnexion restent à confirmer.
