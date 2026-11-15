# Journal de bord — login.teamviewer.com

## Préparation du projet

Avant de commencer les tests, on a pris le temps de se mettre en place en groupe. J'ai créé un compte sur YesWeHack et exploré la plateforme pour comprendre comment fonctionne un programme de bug bounty : la section Hacktivity, le Hall of Fame, la manière dont les programmes présentent leur périmètre. Pour monter en compétence, je me suis entraîné sur les labs de PortSwigger (Web Security Academy) et sur DVWA / Juice Shop installés en local avec Docker et Burp Suite, et j'ai fait quelques recherches en plus du cours sur la méthodologie du bug bounty.

Une fois à l'aise, on a choisi en groupe le programme TeamViewer et décidé de se concentrer sur une seule classe de vulnérabilité : le contrôle d'accès (IDOR). On a lu attentivement l'annonce du programme sur YesWeHack — le périmètre autorisé, les règles d'engagement — et on s'est réparti les trois domaines. De mon côté, j'ai pris `login.teamviewer.com`.

## Mise en place et première reconnaissance

J'ai commencé par configurer Burp Suite en limitant le périmètre aux trois domaines exacts, sans sous-domaines, pour rester strictement dans le scope. J'ai ensuite fait un premier tour des pages de connexion de `account.` et `login.` pour comprendre le flux d'authentification : connexion par email/mot de passe ou par SSO, et un paramètre `redirect_uri` visible dans l'URL.

Deux choses m'ont marqué dès le départ. D'abord, l'API répond en HTTP 200 même quand il y a une erreur ou un refus : le vrai statut est caché dans le corps JSON. Ensuite, le backend tourne sur ASP.NET, derrière Cloudflare.

## Cartographie de la console authentifiée

J'ai ensuite cartographié l'intégralité du menu une fois connecté. J'ai vite compris que l'application est une SPA : cliquer sur un onglet ne déclenche quasiment aucun appel réseau, c'est le rechargement (F5) qui relance toutes les requêtes d'un coup. C'est devenu ma technique pour relever l'inventaire complet des endpoints de chaque page.

Les sections Accueil (déploiement, sessions, scripts) et L'Entreprise (gestion des utilisateurs) ne montrent pas grand-chose côté objets, mais j'y ai repéré `/SuperUser/GetCompanyList`, un endpoint à privilège élevé appelé même par mon compte gratuit (il répond par un refus `"s":0`). Les sections Remote Management (monitoring, asset management, endpoint protection, backup) et Assist AR sont surtout des page de fonctionnalités payantes, inaccessibles avec un compte gratuit : à part `/Backup/RequestBackupDeviceList`, aucune n'a d'appel métier intéressant.

Le vrai intérêt était dans les Groupes et les Réglages de profil. C'est là que j'ai fait l'inventaire des identifiants d'objets : des `GroupId` numériques visibles directement dans l'URL, des `buddyId` numériques, des `ChainId` en GUID. J'ai aussi remarqué que les endpoints qui listent les objets (`GetBuddies`, `GetAllManagedGroups`) partent avec un corps vide : le serveur identifie donc le propriétaire par la session, et pas par un paramètre fourni par le client. À la fin de la cartographie, j'avais sorti mes pistes prioritaires : les groupes à identifiant numérique, `UpdateProfile`, et les endpoints de jetons.

## Tests de contrôle d'accès

Pour l'IDOR horizontal, je me suis concentré sur `/Management/GetAdditionalBuddyDetails`, qui renvoie les détails d'un appareil à partir d'un `buddyId`. J'ai créé un deuxième compte (B) avec son propre appareil (`buddyId` 1674851190), puis, depuis la session de mon compte A, j'ai essayé de lire l'appareil de B. Le serveur a refusé (`"s":0`), sur deux variantes de requête, alors que l'appareil de A restait accessible normalement. Comme l'appareil de B existe réellement, ce refus est bien une décision d'autorisation et pas un simple « objet introuvable » : il n'y a donc pas d'IDOR ici.

J'ai ensuite testé l'attribution de masse sur `/UserManagement/UpdateProfile`, en injectant des champs de privilège (`AccountType`, `IsAdmin`, `CompanyId`…). La requête passait (`"s":1`), mais en relisant le compte via `/Account/GetAccount`, aucun des champs injectés n'avait été pris en compte : c'était un faux positif, seul le `DisplayName` (champ légitime) avait changé. Bonne leçon au passage : ne jamais se fier au code de retour sans vérifier la persistance.

Enfin, j'ai regardé les endpoints de jetons (`GetAllTokens`, `GetRegisteredApplicationList`) : corps vides, scopés par la session, donc aucune surface à manipuler. J'ai aussi noté que le refus « Droits insuffisants » des rapports de connexion est décidé côté client, sans même un appel au serveur.

## Rédaction et organisation du dépôt

Pour finir, j'ai rédigé ma section du rapport (cartographie, tests, limites, conclusion), rempli la fiche de cible et ce journal, et organisé le dépôt Git : ma branche, la fiche, le journal, les preuves masquées et le périmètre. J'ai aussi relu l'ensemble pour vérifier la cohérence avec le travail des autres membres.
