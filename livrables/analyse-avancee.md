# Analyse avancée des contrôles TeamViewer

Cette annexe complète la synthèse du rapport. Elle distingue les résultats observés, les questions ouvertes et les contrôles que l’équipe produit pourrait intégrer à ses tests de régression. L’étude porte sur la console login.teamviewer.com et un compte de test gratuit.

## 1. Délimiter les décisions de sécurité

| Parcours | Décision à protéger | Signal observé | Question ouverte |
| --- | --- | --- | --- |
| Activation | Autoriser l’accès après vérification de l’adresse | Le flux normal a demandé une activation par e-mail | Quelles opérations exigent cette vérification côté serveur ? |
| Récupération | Autoriser un changement de mot de passe à partir d’une demande valide | Réception du courriel et confirmation du changement | Le secret est-il consommé à la première soumission réussie ? |
| Modification du profil | Autoriser une opération authentifiée dans le contexte attendu | Rejet HTTP 403 avec en-tête de jeton absent ou invalide | Où se fait la validation et quelles autres opérations utilisent la même règle ? |
| Révocation | Refuser les accès d’une session révoquée | Le journal GitHub décrit une redirection vers la connexion après révocation | Quel délai de propagation et quelle portée sur les sessions et jetons associés ? |

L’activation et la récupération relèvent du parcours d’authentification étudié sous CWE-287. La modification du profil relève du contrôle étudié sous CWE-352. Ces classifications décrivent les sujets étudiés. La note de révocation complète l’analyse du cycle de vie de la session. L’attribution d’une CWE à un défaut demanderait un défaut effectivement établi.

## 2. Relier les preuves aux conclusions

| Affirmation | Preuve disponible | Portée de la conclusion |
| --- | --- | --- |
| La référence modifie le profil | HTTP 200 et changement du nom affiché | Le code HTTP et l’état du compte convergent. Le JSON contient un message d’erreur dont la cause reste inconnue. |
| Une valeur invalide est rejetée | HTTP 403 et nom inchangé | Rejet observé pour la variante envoyée. Le composant qui a pris la décision reste inconnu. |
| L’absence de l’en-tête est rejetée | HTTP 403, nom inchangé, puis rejeu positif avec les mêmes cookies dans les requêtes communiquées | Le contrôle positif réduit l’hypothèse d’une session expirée. Les éléments disponibles indiquent que la présence de l’en-tête a compté dans cette comparaison. |
| Le lien de récupération est à usage unique | Le formulaire a été réaffiché après réouverture du lien | Verdict indéterminé. L’affichage du formulaire renseigne sur l’interface. L’étape qui décide d’autoriser le changement reste à examiner par l’équipe produit. |
| La révocation isole deux sessions | Le journal de sessions décrit Safari redirigé et Chrome toujours connecté | Résultat rapporté pour deux navigateurs. Vérifier les captures associées avant de le présenter comme preuve principale. |

Deux dimensions différentes ont été mesurées pour le profil : la réponse de la requête et l’effet visible sur le compte. Pour la récupération, seule la confirmation de la première opération et l’affichage ultérieur du formulaire sont disponibles. La preuve ne couvre donc pas la même profondeur sur les deux parcours.

Le rejeu direct conserve le contexte authentifié. L’étude ne mesure ni le comportement depuis une origine tierce ni la liaison du jeton à une autre session. Une conclusion sur ces propriétés dépasserait la couverture réelle. Le relevé public contient une transcription expurgée. Les réponses ne permettent pas de déterminer si la règle est appliquée dans l’application ou dans un composant intermédiaire.

## 3. Examiner les explications concurrentes

- **Session expirée.** Le contrôle positif après le refus sans en-tête montre qu’une opération a encore abouti avec les cookies communiqués. Cela réduit fortement l’explication par une expiration de la session pendant cette comparaison.
- **Requête mal formée.** Une ligne vide accidentelle avait été repérée puis corrigée avant l’essai. Sans traces intégrales expurgées, l’identité de tous les champs entre les requêtes reste non vérifiée.
- **Message JSON ambigu.** La référence affiche un message générique malgré le changement du nom. Deux constats sont défendables pour le rapport : le changement visible a eu lieu et la réponse ne l’exprime pas clairement. La cause de cette incohérence reste inconnue.
- **Échec de l’instrumentation.** Les deux essais Safari ont fourni une trace manquante ou un en-tête non modifié. Ils n’apportent pas de preuve supplémentaire de rejet côté serveur. Ils documentent néanmoins pourquoi le protocole a été changé.

## 4. Qualifier l’impact métier

**Impact observé.** Dans la comparaison, une demande avec un jeton invalide ou absent n’a pas produit de modification visible du nom, tandis que la référence a modifié l’affichage du profil. Aucune compromission, perte de données ou interruption de service n’a été observée.

**Impact hypothétique.** Une modification non autorisée du nom pourrait fausser la présentation du compte. Des effets sur les droits, un appareil distant ou le contrôle du compte demanderaient des preuves distinctes. Toute estimation de gravité ou de récompense doit rester liée à un résultat démontré.

**Impact opérationnel.** Un message d’erreur générique associé à une opération effectivement appliquée peut conduire un utilisateur à répéter une action ou à solliciter le support. Il s’agit ici d’une hypothèse d’ergonomie à examiner, sans volume ni coût mesurés.

## 5. Proposer des critères de régression à l’équipe produit

Ces critères sont des résultats attendus pour une suite interne. Ils correspondent à des propriétés que l’équipe peut vérifier sur un environnement qu’elle administre.

| Priorité | Propriété | Critère d’acceptation |
| --- | --- | --- |
| 1 | Protection des écritures du profil | Les demandes rejetées laissent le profil inchangé. Le résultat applicatif d’une écriture réussie décrit correctement l’état obtenu. |
| 1 | Cycle de vie de la récupération | Le secret expire, ne peut autoriser qu’une opération et une seconde opération concurrente est également refusée. |
| 2 | Révocation ciblée | Une session révoquée perd ses accès protégés dans le délai défini. Une autre session légitime reste disponible selon la politique du produit. |
| 2 | Cohérence de couverture | L’équipe recense les actions qui modifient des données et documente le contrôle prévu par action. |
| 3 | Diagnostic | Les journaux internes distinguent un refus de sécurité d’une erreur métier. Les réponses publiques restent sobres et ne contiennent pas de secret. |

## 6. Valoriser les heures de projet sans reconstruire le journal

Le temps global indiqué est de l’ordre de 30 heures ou davantage, d’après l’estimation de l’étudiant. Aucun nombre d’heures par phase n’a été établi dans les éléments disponibles. Reconstituer les durées uniquement à partir de notes ou d’horaires réellement conservés.

| Phase | Trace exploitable | Apport au rapport |
| --- | --- | --- |
| Cadrage et préparation | Fiche cible, consignes et choix des parcours | Explique les limites du périmètre et les décisions de méthode |
| Repérage et récupération | Journal et cartographie authentifiée | Donne le contexte des essais et les verdicts indéterminés |
| Instrumentation | Essais Safari et préparation de Burp | Montre comment une preuve inadéquate a motivé un changement d’outil |
| Comparaison et validation | Résultats 200/403, état avant/après et contrôle positif | Étaye le résultat principal |
| Synthèse et préparation orale | Relevé expurgé, synthèse et plan | Rend le travail vérifiable par le jury |

Pour la soutenance, présenter une décision par étape : pourquoi choisir le nom comme témoin réversible, pourquoi abandonner la substitution Safari, pourquoi vérifier l’état et pourquoi ajouter un contrôle positif. Cette séquence rend visible le travail d’analyse même en l’absence de faille confirmée.

Sources de travail : [journal](../targets/login.teamviewer.com/notes/journal.md), [fiche du scénario](../targets/login.teamviewer.com/notes/essai-jeton-invalide.md), [relevé expurgé](../targets/login.teamviewer.com/evidences/comparaison-profil.md).
