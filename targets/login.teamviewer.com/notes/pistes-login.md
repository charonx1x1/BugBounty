# Pistes complémentaires — connexion et cycle de vie du compte

## Bilan de l’investigation

| Piste | Résultat | Limite |
| --- | --- | --- |
| Révocation de session | La note GitHub rapporte le passage de six à cinq sessions. Safari a perdu l’accès après actualisation, pendant que Chrome est resté connecté. | Captures sources et délai de révocation à confirmer. La confiance du navigateur reste indéterminée. |
| Récupération du compte | Le courriel a été reçu et le changement de mot de passe confirmé. Le formulaire a réapparu après réouverture du lien. | L’affichage du formulaire ne confirme pas que le lien peut autoriser un second changement. |
| MFA et nouvel appareil | TeamViewer documente la MFA et l’autorisation des appareils de confiance. | Comportement sur le compte de test non vérifié. |
| En-têtes de connexion | Safari a reçu HTTP 200 pour le document /LogOn. HSTS, CSP et SAMEORIGIN observés. La CSP complète ne contient ni form-action, ni base-uri, ni frame-ancestors. | La cause du HTTP 403 obtenu en accès direct reste inconnue. |
| Dépendances avant saisie | Le HAR contient 42 requêtes HTTPS, dont deux POST reCAPTCHA (401 puis 200). | Les métadonnées disponibles ne démontrent aucune fuite. |

**Menu identifié d’après le journal : « Connexions actives ».** La note décrit le retrait de l’entrée Safari dans la liste, passée de six à cinq. Après actualisation, Safari revient à la connexion tandis que Chrome garde l’accès. Verdict : fin de la session Safari rapportée. La commande « Appareils de confiance » concerne l’autorisation du navigateur pour des connexions futures. Aucun retrait de cette autorisation n’est attesté. La capture du clic exact reste à retrouver.

**Récupération :** changement de mot de passe confirmé dans le flux normal. Usage unique du lien indéterminé, car sa réouverture a seulement affiché le formulaire.

**MFA :** comportement indéterminé sur le compte de test. Les preuves disponibles montrent les options de l’interface et la documentation du fournisseur.



## Priorité 1 — Session active et navigateur de confiance

TeamViewer Classic documente une confiance distincte par navigateur pour la console. La confiance concerne les connexions futures. Une session active concerne un accès déjà ouvert. Le journal de révocation fourni décrit le retour de Safari à la connexion pendant que Chrome reste connecté. Il reste à identifier la commande utilisée dans les captures pour attribuer correctement le résultat.

- [ ] Associer une capture expurgée au menu utilisé : « Connexions actives » ou « Appareils de confiance ».
- [ ] Associer les états des deux navigateurs au même scénario et préciser si le délai de révocation a été mesuré.
- [ ] Noter séparément le verdict sur la session ouverte et le verdict sur la confiance du navigateur. Laisser le second indéterminé si aucune preuve ne le couvre.

[Documentation TeamViewer Classic sur les appareils de confiance](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-classic/security/trusted-devices/trusted-devices/)

## Priorité 2 — MFA du compte et dépendance à la messagerie

TeamViewer présente la MFA du compte comme une alternative au mécanisme d’autorisation des nouveaux appareils par e-mail. Cela change le rôle de la messagerie dans le parcours de connexion. Les notes du projet documentent l’activation du compte par e-mail et les options visibles dans la console. Elles ne démontrent pas quelle politique s’applique à chaque nouvelle connexion.

- [ ] Construire un tableau des parcours : activation du compte, connexion sur un nouveau navigateur, récupération du mot de passe et récupération MFA.
- [ ] Pour chaque parcours, indiquer le facteur attendu d’après la documentation, le signal réellement observé et le verdict.
- [ ] Marquer « documenté par le fournisseur » pour les contrôles MFA sans preuve issue du compte de test.

[Documentation TeamViewer sur la MFA du compte](https://www.teamviewer.com/en-us/global/support/knowledge-base/teamviewer-remote/account/two-factor-authentication-for-your-account/)

## Priorité 3 — Attribuer les protections à la bonne réponse

Le relevé HTTP local contient X-Frame-Options: SAMEORIGIN pour la sauvegarde du profil. Cette preuve concerne cette réponse précise. La page de connexion et la réponse de récupération doivent avoir leur propre relevé.

- [ ] Dans les captures existantes, retrouver la réponse du document de connexion et distinguer ses éventuelles redirections.
- [ ] Relever, si visibles, HSTS, Cache-Control, Referrer-Policy et les directives d’encadrement. Associer chaque en-tête au chemin exact et au statut.
- [ ] Indiquer « non observé sur cette preuve » si l’en-tête ou la réponse n’est pas disponible. Ne déduire aucune faille de la seule absence d’un en-tête.

[Relevé HTTP initial](observation-http-profil.md) · [Journal du parcours de récupération](journal.md)

## Résultats de la revue

**Révocation.** La [note publiée](https://github.com/Nadadana1/BugBounty/blob/main/targets/login.teamviewer.com/notes/gestion-sessions.md) décrit une action sur la liste des connexions actives : six entrées avant, cinq après, puis Safari redirigé vers la connexion et Chrome toujours authentifié. Cela étaye un verdict de révocation ciblée rapporté. Le délai, les captures sources et le statut de confiance du navigateur ne sont pas établis par cette note.

| Parcours | Contrôle documenté ou attendu | Preuve du projet |
| --- | --- | --- |
| Activation du compte | Vérification de l’adresse | Message reçu et activation confirmée |
| Nouveau navigateur | Autorisation d’appareil de confiance via e-mail selon la configuration Classic | Écran d’appareils de confiance observé. Nouvelle autorisation non attestée |
| Réinitialisation du mot de passe | Lien de récupération par e-mail | Réinitialisation confirmée. Usage unique indéterminé |
| Récupération MFA | Code de secours selon la documentation TeamViewer | Parcours documenté par le fournisseur. Aucune preuve sur le compte de test |

**En-têtes de connexion.** La consultation publique de [la page de connexion](https://login.teamviewer.com/LogOn) n’a pas fourni ses en-têtes. Le relevé direct a échoué à la résolution du domaine depuis cet environnement. HSTS, Cache-Control, Referrer-Policy et les directives d’encadrement de la page restent indéterminés. Le relevé du profil ne permet pas de les attribuer à la page de connexion.

### Observation directe de /LogOn

Un GET HTTPS sans session a reçu HTTP/2 403. La réponse de refus portait Cache-Control: no-store, Strict-Transport-Security: max-age=31536000, X-Content-Type-Options: nosniff et Referrer-Policy: strict-origin-when-cross-origin. Ces valeurs décrivent la réponse 403. Les protections de la réponse normale qui affiche le formulaire restent à relever. La cause du refus n’a pas été isolée.

### Réponse normale du formulaire dans Safari

Une navigation normale vers `/LogOn` a affiché le formulaire « S’identifier ». Le document sélectionné dans l’onglet Réseau a reçu **HTTP 200**.

| En-tête | Valeur relevée |
| --- | --- |
| Cache-Control | no-cache, no-store |
| Strict-Transport-Security | max-age=31536000 |
| Referrer-Policy | strict-origin-when-cross-origin |
| X-Content-Type-Options | nosniff |
| X-Frame-Options | SAMEORIGIN |
| Content-Security-Policy | Présente, avec default-src 'none'. Politique complète non évaluée. |

Ce relevé confirme les en-têtes sur la réponse du document de connexion. Le HTTP 403 précédent concernait une requête directe. La différence de statut ne suffit pas à attribuer le refus à un contrôle précis.

### Lecture partielle de la CSP

L’extrait de Safari confirme `default-src 'none'` et la présence de `'unsafe-inline'` dans `script-src`, ainsi que des directives `connect-src` et `media-src`. Le texte accessible s’arrête au milieu d’une directive. La présence de `form-action`, `base-uri` et `frame-ancestors` reste indéterminée. L’en-tête distinct `X-Frame-Options: SAMEORIGIN` est confirmé. Aucune injection n’a été démontrée.

### Ressources chargées lors de l’ouverture du formulaire

La liste Réseau associe plusieurs scripts et feuilles de style à `login.teamviewer.com`, dont `logonV2.compiled.js`. Elle identifie aussi `wsp.js` sur `wsp.teamviewer.com`, un hôte distinct du document de connexion. Des ressources nommées `recaptcha__fr.js` et `onetrust-overrides.css` étaient visibles. Leurs noms seuls ne permettent pas d’attribuer leurs hôtes ni de déduire quelles données leur sont transmises. Ce relevé porte sur l’affichage du formulaire avant soumission.

### Origine de deux ressources confirmée dans Safari

L’URL de chaque requête dans Réseau confirme que le script `recaptcha__fr.js` est servi par `www.gstatic.com` et que la feuille `onetrust-overrides.css` est servie par `login.teamviewer.com`. Il s’agit des hôtes de ces deux ressources. Le relevé ne renseigne pas sur les données éventuellement transmises aux services associés.

### CSP complète — réponse 200 de /LogOn

Lecture de l’en-tête dans l’export réseau Safari.

- `form-action` absente de cette politique
- `base-uri` absente de cette politique
- `frame-ancestors` absente de cette politique

X-Frame-Options: SAMEORIGIN a été observé séparément.

### Trafic enregistré à partir de la réponse 200 du formulaire

Le segment de l’export Safari contient 42 requêtes HTTPS. TeamViewer reçoit 21 GET (19 sur login.teamviewer.com, un sur wsp.teamviewer.com et un sur www.teamviewer.com). Les hôtes externes présents sont fonts.gstatic.com (2 GET), www.gstatic.com (11 GET) et www.recaptcha.net (6 GET et 2 POST). Aucun POST vers login.teamviewer.com n’apparaît dans ce segment. Le comptage porte sur les hôtes et méthodes. Le contenu des échanges n’a pas été examiné.

### Clôture de la revue passive

- POST 1 vers reCAPTCHA : HTTP 401, Cookie visible : False, Referer visible : True, corps textuel enregistré : True.
- POST 2 vers reCAPTCHA : HTTP 200, Cookie visible : False, Referer visible : True, corps textuel enregistré : True.

Les valeurs des en-têtes et des corps ont été écartées du relevé. Une absence dans le HAR ne démontre pas une absence sur le réseau. Aucun identifiant n’a été saisi pendant cette capture.

### Observation en direct : accès à la liste des sessions

Une navigation ordinaire dans Safari vers `/nav/profile/active-logins` a conduit à `/LogOn/` et au formulaire « S’identifier ». La liste des sessions n’a pas été affichée dans cette fenêtre. Ce résultat documente la redirection dans cet état du navigateur. Il ne permet pas de dater la fin de session ni d’en attribuer la cause à une révocation ou à un retrait de confiance. Récupération et MFA : verdicts inchangés.

### Comparaison des deux menus après reconnexion

- **Connexions actives** (`/nav/profile/active-logins`) affiche « Session actuelle ». Il s’agit d’un accès déjà ouvert.
- **Appareils de confiance** (`/nav/profile/trust-management`) gère les appareils et adresses IP de confiance. L’interface indique qu’après retrait d’une permission, une nouvelle demande d’autorisation par e-mail est prévue lors d’une tentative ultérieure.

Les deux écrans ont été vérifiés en lecture seule. Le comportement après retrait de la confiance, l’usage unique du lien de récupération et la MFA sur le compte restent indéterminés.

### État de la MFA dans le compte de test

Dans Safari, le menu Sécurité affiche « Activer l’authentification à deux facteurs ». Cela indique que la MFA est proposée et semble inactive sur ce compte au moment du relevé. L’option de récupération à divulgation nulle de connaissance est également proposée. Aucun réglage n’a été modifié. L’application et la récupération de la MFA restent indéterminées.

### Paramètres du navigateur

Le menu « Paramètres navigateur » affiche « Vous n’avez actuellement enregistré aucun paramètre pour ce navigateur ». Cet écran n’affiche aucune durée de session. La durée et le comportement de l’option « Maintenir la connexion » restent indéterminés.
