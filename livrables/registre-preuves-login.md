# Registre des preuves — TeamViewer Management Console

| ID | Hôte et requête | Statut | Source et constat |
| --- | --- | --- | --- |
| HTTP-01 | login.teamviewer.com · GET /LogOn | 200 | Vérifié dans le HAR Safari. Formulaire public, CSP présente, SAMEORIGIN et no-cache, no-store. |
| HTTP-02 | login.teamviewer.com · GET /LogOn | 403 | Relevé direct conservé dans les notes. no-store. Cause du refus indéterminée. |
| HTTP-03 | login.teamviewer.com · POST /UserManagement/UpdateProfile | 200 | Relevé de sauvegarde conservé séparément. Nom modifié à l’écran malgré le message JSON générique. |

Le HAR relu contient HTTP-01. HTTP-02 et HTTP-03 proviennent de relevés distincts. La CSP confirmée est celle de HTTP-01.

## Révocation Safari–Chrome

| État | Source disponible | Portée |
| --- | --- | --- |
| Safari et Chrome connectés, six entrées affichées | Journal GitHub | Rapporté |
| Suppression de l’entrée Safari depuis Chrome, puis cinq entrées | Journal GitHub | Rapporté |
| Safari redirigé vers la connexion après actualisation | Journal GitHub | Rapporté pour cet essai |
| Chrome reste connecté après actualisation | Journal GitHub | Rapporté |
| Confiance du navigateur et délai exact | Aucune preuve correspondante | Indéterminés |

Aucune capture identifiable de cette séquence n’a été retrouvée parmi les images du dossier outputs. Une redirection Safari observée séparément avant reconnexion ne complète pas la chronologie de l’essai de révocation.

## Récupération

Réinitialisation réussie d’après l’interface. La réouverture du lien a affiché un formulaire. L’usage unique du lien, la notification après changement et l’effet sur les sessions restent indéterminés.

[Relevés HTTP](https://github.com/Nadadana1/BugBounty/blob/main/targets/login.teamviewer.com/notes/pistes-login.md) · [Journal de révocation](https://github.com/Nadadana1/BugBounty/blob/main/targets/login.teamviewer.com/notes/gestion-sessions.md)

## HTTP-01 — Extrait expurgé du HAR

`GET /LogOn` sur `login.teamviewer.com` → HTTP 200. En-têtes sélectionnés :

- `content-type: text/html; charset=utf-8`
- `cache-control: no-cache, no-store`
- `strict-transport-security: max-age=31536000`
- `x-content-type-options: nosniff`
- `x-frame-options: SAMEORIGIN`
- `referrer-policy: strict-origin-when-cross-origin`

CSP présente. Directives relevées : child-src, connect-src, default-src, font-src, frame-src, img-src, media-src, report-uri, script-src, style-src. Les directives form-action, base-uri et frame-ancestors sont absentes de cet en-tête.

## HTTP-03 à HTTP-06 — Effet sur le profil

Les quatre lignes regroupent les relevés expurgés de la sauvegarde du profil, distincts du HAR public.

| ID | État de l’en-tête | Statut | Résultat visible |
| --- | --- | --- | --- |
| HTTP-03 | Valide, référence initiale | 200 | Nom modifié malgré le message générique |
| HTTP-04 | Invalide | 403 | Nom initial affiché |
| HTTP-05 | Absent | 403 | Nom initial affiché |
| HTTP-06 | Valide, contrôle positif après HTTP-05 | 200 | Nom modifié |

Le contrôle positif rend une session expirée moins plausible comme explication du rejet dans la seconde série. Les relevés appuient le rôle de l’en-tête dans le scénario étudié. Le comportement d’une requête provenant d’une origine tierce reste indéterminé.

[Compte rendu des essais](https://github.com/Nadadana1/BugBounty/blob/main/targets/login.teamviewer.com/notes/essai-jeton-invalide.md)
