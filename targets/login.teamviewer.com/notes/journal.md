# Journal de bord — login.teamviewer.com

## Préparation et premières observations

Cette première étape porte sur les documents du projet et la page `https://login.teamviewer.com/LogOn` dans un navigateur, sans authentification.

### Avancement

- Lecture du README public, des règles d’engagement et des modèles de fiche cible et de journal du dépôt.
- Vérification de la présence du domaine dans le programme officiel.
- Ouverture de la page de connexion et lecture des éléments affichés.
- Création locale de la fiche cible, de ce journal et des prochaines étapes.

### Observations

La page a pour titre « TeamViewer Management Console ». L’adresse affichée après chargement est `https://login.teamviewer.com/LogOn`.

La page est en français. Elle contient les champs « E-mail » et « Mot de passe », le bouton « S’identifier », la case « Maintenir la connexion » décochée, les liens « Mot de passe oublié ? » et « S’inscrire », ainsi qu’une mention d’authentification unique.

Les destinations affichées pour la récupération et l’inscription sont respectivement `/LogOn#lost-password` et `/LogOn#register`. Leur contenu reste à observer.


### Suite du travail

Les tests de sécurité restent à réaliser. Il faut maintenant compléter le repérage, choisir les CWE avec le groupe et conserver les preuves des vérifications.

## Repérage avec un compte de test

Le parcours d’inscription, de vérification de l’adresse et de connexion a été effectué. La console a ensuite été parcourue avec le compte gratuit : profil, sécurité, connexions actives, appareils de confiance, gestion des utilisateurs, sessions et scripts.

La gestion des utilisateurs propose un essai professionnel ; les scripts sont annoncés comme absents du forfait. La liste des sessions ne présente aucune donnée avec les filtres affichés. Aucun paramètre de sécurité n’a été modifié pendant ce repérage.

Les observations et leurs limites figurent dans [la cartographie authentifiée](cartographie-authentifiee.md). Aucune vulnérabilité n’est confirmée à ce stade.

## Observation du formulaire de récupération

L’ouverture de `/LogOn#lost-password` dans la fenêtre déjà authentifiée a abouti à `/nav/home`. Dans une nouvelle fenêtre privée Safari, la même adresse a affiché « Demande de réinitialisation du mot de passe » et « Regagnez l’accès à votre compte TeamViewer ».

Le formulaire présente un champ E-mail, une case reCAPTCHA « Je ne suis pas un robot », un bouton « Modifier le mot de passe » et un lien de retour « S’identifier ». Aucun nouveau mot de passe n’est demandé sur cet écran initial.

Aucune demande de récupération n’a été envoyée. Le CAPTCHA n’a pas été validé et aucun mot de passe n’a été changé. Sa présence visuelle ne démontre pas une vérification effective côté serveur. Le contenu du message de récupération, la durée de validité et l’usage unique du lien restent non vérifiés.

## Envoi de la demande de récupération

Après accord pour valider le CAPTCHA, sa case a affiché « Validation terminée ». Une seule demande a été soumise pour le compte A. Le formulaire a redirigé vers `/LogOn#` avec un message indiquant que la requête avait été traitée et qu’un e-mail contenant les instructions allait être envoyé. Cette confirmation ne prouve pas la réception du message. Aucun nouveau mot de passe n’a été saisi ni enregistré. Les propriétés du lien de récupération restent non vérifiées.

Preuve locale : `outputs/recuperation-confirmation.png` (dans le dossier de travail, non publiée sur GitHub).

## Réception du message de récupération

Après actualisation de la boîte du compte A, le message « Lien de réinitialisation de votre mot de passe TeamViewer » a été reçu et ouvert. L’expéditeur affiché est `PasswordReset-noreply@teamviewer.com` ; cette indication seule ne constitue pas une vérification cryptographique de l’expéditeur. Le message confirme une demande et indique de l’ignorer si elle n’est pas volontaire. Le lien de récupération n’a pas été ouvert à cette étape ; son secret n’est pas reproduit. Aucun mot de passe n’a été changé. La réception du message est désormais confirmée ; la validité et l’usage unique du lien restent non testés.

## Réinitialisation et réouverture du lien

Après saisie et validation du nouveau mot de passe par l’utilisateur, TeamViewer a affiché « Votre mot de passe a été modifié avec succès. » et le formulaire de connexion. La réussite est attestée par ce message ; une connexion avec le nouveau mot de passe reste à vérifier.

Le même lien de récupération a ensuite été rouvert une fois depuis le message reçu. Le formulaire de réinitialisation avec deux champs vides est réapparu, sans refus visible à cette étape. Aucune seconde soumission de mot de passe n’a été effectuée. Cela ne démontre pas que le jeton reste utilisable : sa validité peut être contrôlée au moment de la soumission. L’usage unique reste donc indéterminé et aucune vulnérabilité de réutilisation n’est confirmée.

## Observation HTTP du profil

Une soumission de connexion a abouti à la console après une vérification automatique anti-robot. Une modification réversible du nom a été observée avec l’inspecteur réseau Safari, puis le nom initial a été rétabli. Voir [le relevé HTTP du profil](observation-http-profil.md) pour la requête, les en-têtes, les particularités de la réponse et les limites. Aucun test de contournement CSRF n’a été réalisé.

## Attributs des cookies

Lecture du stockage Safari sans modification. `.ASPXAUTH` est affiché Secure, HttpOnly et SameSite=Strict. Le cookie `__xFlUD3rsEr4sd` est Secure et HttpOnly, avec SameSite affiché « — ». Voir [le relevé et le bilan](cookies-et-bilan.md). Les valeurs des cookies ne sont pas incluses dans les notes. Aucune vulnérabilité confirmée.

## Essai ciblé avec un jeton invalide

Une substitution locale Safari a été configurée pour remplacer l’en-tête du profil par `test-invalide`, puis une sauvegarde sans changement du nom a été déclenchée. La navigation a empêché de conserver les détails réseau de l’essai. Résultat non concluant : aucun refus ni contournement démontré. La substitution a été supprimée et le nom « Projet test » vérifié. Voir [le compte rendu de l’essai](essai-jeton-invalide.md).

## Préparation de la reprise du contrôle

L’option « Conserver l’historique » du panneau Réseau Safari a été activée et sa coche vérifiée visuellement. Sa conservation effective lors d’une nouvelle navigation reste à vérifier. Au même moment, TeamViewer affichait « Vous avez été automatiquement déconnecté. ». La cause de cette déconnexion n’est pas déterminée ; elle ne peut pas être attribuée au précédent essai sans trace supplémentaire. Aucun nouvel essai de jeton invalide n’a été envoyé. La reprise dépend d’une reconnexion au compte A. Preuve locale : `outputs/reseau-historique-active.png`.

## Reprise du contrôle avec trace conservée

Reconnexion réussie. La nouvelle tentative avec substitution locale a produit une erreur de chargement sans statut HTTP, et la trace affichait encore le jeton d’origine. Le test reste non concluant. La substitution a été supprimée et le nom initial vérifié après rechargement. Voir [les détails et limites](essai-jeton-invalide.md).

## Préparation du contrôle dans Burp Community

Burp Suite Community a été ouvert avec un projet temporaire et son navigateur intégré. La connexion au compte A a réussi : la page `/nav/home` affichait « Projet test ». Le profil général affichait ensuite le nom initial. Une sauvegarde sans changement a été déclenchée ; l’interface a navigué vers `/nav/buddies/g/0`.

La requête de sauvegarde et sa réponse n’ont pas pu être vérifiées dans l’historique Burp. La lecture de la fenêtre principale ne retournait que son titre, puis la capture de cette fenêtre a expiré. Cela établit un blocage de l’inspection de l’outil, sans déterminer sa cause ni prouver un arrêt de Burp. Aucune requête de profil modifiée n’a été envoyée dans cette étape. Le contrôle serveur du jeton anti-CSRF reste indéterminé.

À reprendre : retrouver l’historique HTTP, identifier une sauvegarde de référence fraîche, vérifier sa réponse avant tout essai comparatif, puis contrôler l’état final du profil. Ne pas exporter les requêtes de connexion ni les valeurs des mots de passe, cookies ou jetons dans le dépôt.


## Résultat du contrôle manuel dans Burp

Les captures et réponses relevées pendant le contrôle manuel montrent qu’un rejeu du profil avec le jeton d’origine renvoie HTTP 200 et affiche le nom « Projet test A ». Après restauration du nom initial, le même scénario avec l’en-tête réglé à `test-invalide` renvoie HTTP 403 ; le nom affiché reste « Projet test ». Défense observée sur cette requête, sans vulnérabilité CSRF démontrée. Voir [la comparaison et ses limites](essai-jeton-invalide.md#comparaison-manuelle-dans-burp-repeater). Les essais Safari antérieurs restent non concluants.


## Complément : en-tête absent

Le rejeu sans en-tête de jeton a obtenu HTTP 403 et un nom inchangé. Le rétablissement d’un jeton valide, avec les mêmes cookies dans les requêtes fournies, a obtenu HTTP 200 et le nom « Projet test A ». Ce contrôle positif renforce l’attribution du rejet à l’absence de l’en-tête. Voir [le complément de la fiche](essai-jeton-invalide.md#complément--en-tête-absent-et-contrôle-positif). Le nettoyage final et la déconnexion restent à confirmer ; aucune nouvelle requête n’a été envoyée pour rédiger cette note.
