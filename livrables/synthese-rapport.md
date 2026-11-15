# Contribution au rapport — console TeamViewer

Version de travail limitée à login.teamviewer.com. Ce texte est une contribution au rapport du groupe, pas le rapport complet d’une vingtaine de pages. Les autres cibles, les membres et la répartition finale des CWE doivent être intégrés par le groupe.

## 1. Executive Summary

L’étude porte sur les parcours de connexion et de récupération du compte, la console authentifiée et la protection de la modification du profil. Les essais ont utilisé un compte de test gratuit et une modification réversible de son nom. Aucune vulnérabilité exploitable n’a été démontrée.

Le résultat principal concerne la sauvegarde du profil : une requête portant un jeton valide modifie le nom, alors que les variantes avec un jeton invalide ou sans l’en-tête du jeton obtiennent HTTP 403 et ne produisent pas de changement visible. Le contrôle positif réalisé après le test sans en-tête confirme que la session pouvait encore effectuer l’opération. Ces résultats établissent une défense observée dans ce scénario, sans valider l’ensemble du site.

## 2. Analyse du programme BBP

La fiche cible consigne le périmètre et les règles relevées dans le programme TeamViewer sur YesWeHack. Le travail est limité à la console login.teamviewer.com et aux données du compte de test. Le nom d’un domaine lié à TeamViewer ne suffit pas à autoriser son test.

Les règles relevées imposent des essais non destructifs, la préservation des données et la limitation des requêtes ; les attaques de déni de service et les interventions sur l’infrastructure sont exclues. Le barème et les exclusions doivent être relus dans le programme officiel avant la remise : cette synthèse n’en constitue pas une nouvelle vérification. Le caractère « Critical » d’un actif ne détermine pas la gravité d’un constat.

L’autorisation du programme et ses limites constituent le cadre opérationnel des tests ; le contexte pédagogique ne remplace pas cette autorisation. Les secrets de session, mots de passe et liens de récupération ne figurent pas dans les preuves publiques. Aucun rapport de vulnérabilité n’est justifié par les seuls constats obtenus.

Source : https://yeswehack.com/programs/teamviewer-bounty-program ; détail : ../targets/login.teamviewer.com/fiche-cible.md.

## 3. Méthodologie et timeline

Le travail suit six phases : lecture du périmètre ; repérage sans compte ; inscription et activation ; cartographie authentifiée et récupération ; observation HTTP dans Safari ; comparaison manuelle dans Burp Repeater. Le journal conserve l’ordre des opérations et les tentatives non concluantes. Aucun horaire manquant n’est reconstitué.

Les premiers essais de substitution Safari n’ont pas permis de vérifier la transmission effective du jeton modifié. Ils ne sont donc pas interprétés comme des rejets de sécurité. Burp a ensuite permis une comparaison ciblée. Chaque verdict combine la réponse HTTP et l’état visible du compte ; un statut 200 ou un message d’erreur, pris isolément, n’est pas une preuve suffisante.

## 4. Résultats techniques

### CWE-352 : contrôle du jeton de la sauvegarde du profil

La requête étudiée est POST /UserManagement/UpdateProfile, de type JSON. Elle inclut des cookies et un en-tête personnalisé nommé __xflud3rser4sd. Le seul changement métier demandé est le passage du nom « Projet test » à « Projet test A ».

| Variante | Réponse | Résultat visible |
| --- | --- | --- |
| Jeton valide | HTTP 200 | Nom changé en Projet test A |
| Jeton invalide | HTTP 403 | Nom resté Projet test |
| En-tête absent, cookie conservé | HTTP 403 | Nom resté Projet test |
| Jeton valide rétabli après l’essai sans en-tête | HTTP 200 | Nom changé en Projet test A |

La réponse positive contient pourtant un message générique « Une erreur non spécifiée est survenue. ». L’effet observé sur le nom montre pourquoi il fallait contrôler l’état du compte. La signification exacte du champ `s` n’a pas été établie.

Conclusion : exigence de présence et contrôle de validité de l’en-tête observés. Aucun contournement CSRF démontré. Les essais sont des rejeux directs ; ils ne constituent pas une exploitation depuis une origine tierce. La liaison entre jeton et session, les autres actions et les contrôles entre comptes ne sont pas validés.

Preuves : ../targets/login.teamviewer.com/notes/essai-jeton-invalide.md et ../targets/login.teamviewer.com/evidences/comparaison-profil.md.

### CWE-287 : observations du parcours d’authentification

Le flux normal d’inscription a demandé une activation par e-mail. La récupération a produit un message et une confirmation de changement de mot de passe. La réouverture d’un lien déjà utilisé a réaffiché un formulaire, sans seconde soumission : cela ne prouve pas sa réutilisabilité. La présence du CAPTCHA ne démontre pas, à elle seule, son efficacité côté serveur. Aucune faiblesse d’authentification n’est établie par ces observations.

Le dépôt contient également une note de révocation de session : elle décrit une session Safari redirigée vers la connexion après révocation, tandis que Chrome reste connecté. Ce résultat provient de la note déjà déposée ; les captures référencées doivent être rapprochées du texte avant d’en faire une preuve principale. Il n’a pas été reproduit lors de cette synthèse. Voir ../targets/login.teamviewer.com/notes/gestion-sessions.md.

### Cookies

Safari affichait Secure et HttpOnly pour les cookies étudiés, SameSite=Strict pour .ASPXAUTH et Lax pour __Secure-CDNCID. Le signe « — » pour le cookie du jeton n’a pas été assimilé à SameSite=None. Ces attributs sont des observations complémentaires, pas une certification de sécurité.

## 5. Impact business

Aucune compromission ni perte de données n’a été observée. Le contrôle du jeton contribue, dans le scénario testé, à empêcher une modification du profil avec un en-tête absent ou invalide. Le changement de nom utilisé ne permet pas de prétendre à une prise de contrôle du compte ou d’appareils. Aucun score CVSS ou montant de récompense n’est attribué à une vulnérabilité non démontrée.

## 6. Feuille de route de remédiation et de suivi

| Priorité | Action | Justification |
| --- | --- | --- |
| Immédiate, projet | Confirmer le rétablissement du nom initial et la déconnexion | La dernière preuve disponible montre Projet test A |
| Avant publication | Exclure les captures contenant des secrets ; vérifier les liens des preuves | Des cookies et jetons apparaissaient dans les captures brutes |
| Avant remise | Rapprocher la note de sessions de ses preuves et confirmer la répartition des CWE | Éviter une conclusion sans preuve ou un doublon avec le groupe |
| Suivi produit éventuel | Étudier la cohérence du message JSON avec l’opération réellement effectuée | Ambiguïté de diagnostic observée, sans faille démontrée |
| Contrôles ultérieurs autorisés | Étendre la vérification à d’autres actions selon un protocole distinct | Les résultats actuels sont limités à une opération |

Aucune correction urgente d’une vulnérabilité confirmée n’est proposée.

## 7. Retour d’expérience

La principale difficulté a été la qualité de la preuve : une substitution configurée ne prouve pas qu’elle a été transmise, et une réponse 200 ne prouve pas le succès métier. Le changement de nom réversible, le contrôle de l’état et le rejeu positif ont permis d’améliorer l’interprétation.

L’assistance IA a aidé à préparer les manipulations, lire les réponses et structurer les notes. Elle a aussi rencontré des limites de contrôle de l’interface et a dû corriger des interprétations trop rapides du message JSON. La validation humaine des captures et du comportement réel reste indispensable. Le bilan distingue ainsi les résultats observés, les hypothèses et les tests non exécutés.

## Complément d’investigation sur le formulaire public

La réponse normale de /LogOn dans Safari est HTTP 200. HSTS, Cache-Control: no-cache, no-store, Referrer-Policy, X-Content-Type-Options: nosniff et X-Frame-Options: SAMEORIGIN ont été relevés. La CSP complète contient default-src 'none' et autorise 'unsafe-inline' dans script-src. Les directives form-action, base-uri et frame-ancestors n’apparaissent pas dans la politique capturée. SAMEORIGIN est présent séparément. Le 403 d’un accès direct reste inexpliqué.

Le segment d’ouverture du formulaire contient 42 requêtes HTTPS, dont deux POST vers reCAPTCHA. Aucun POST vers login.teamviewer.com ne figure dans ce segment. Le relevé ne permet pas de qualifier les valeurs transmises ni de conclure à une fuite.

La revue passive est terminée pour la capture disponible. La portée exacte de la révocation, l’usage unique du lien de récupération et le comportement des parcours MFA et SSO restent à établir. Le rétablissement final du nom et la déconnexion restent à confirmer.

[Registre des preuves HTTP et des sessions](registre-preuves-login.md). Le registre distingue les preuves directes du HAR et les étapes de révocation rapportées dans le journal.
