
## Cartographie (login.teamviewer.com)

**TeamViewer : page d'accueil** -> `../nav/home`
- Actions : propose d'explorer le côté admin avec une redirection vers `web.teamviewer.com`
- Endpoints observés : `/Flume/View` (télémétrie de navigation, se déclenche sur toute page)

### ACCUEIL

**Configurer et déployer** : création d'un hôte -> `../nav/deploy/modules`
- Endpoints observés : `/Flume/View`, `/Update/WaitForUpdate` (polling)
- -> rien d'intéressant pour l'IDOR

**Sessions** : création et modification d'une session -> `../nav/servicequeue/sessions`
- Endpoints observés : 0

**Scripts** : utilisation des scripts -> `../nav/scripts`
- Nécessite une licence TeamViewer premium
- Endpoints observés : 0

### L'ENTREPRISE

**Gestion des utilisateurs** : gérer les utilisateurs déjà créés -> `../nav/users`
- Nécessite une licence pro, essai gratuit proposé
- Lien « rejoindre une société existante » -> `/nav/users/joincompany`
- Endpoints observés :
  - `/SuperUser/GetCompanyList` (body vide) — endpoint à privilège élevé, déclenché même par un compte gratuit non-admin ; rejeté via un pattern « soft error » (200 OK + `"s":0` dans le JSON, pas de 403/401) -> candidat pour test de contrôle d'accès vertical
  - `/Flume/View` (télémétrie, déjà noté)

### REMOTE MANAGEMENT

- **Aperçu** -> `../nav/rm/overview` : propose d'essayer TeamViewer Remote (`web.teamviewer.com/...`) et la boutique. Endpoints observés : aucun.
- **Monitoring** -> `../nav/rm/monitoring/welcome` : bouton vers `web.teamviewer.com/...`. Endpoints observés : aucun.
- **Asset Management** -> `../nav/rm/asset-management/welcome` : suivi/accès aux infos des appareils depuis un tableau de bord ; bouton vers `web.teamviewer.com/`. Endpoints observés : aucun.
- **Endpoint Protection** -> `../nav/rm/mbendpointprotection/welcome` : sécurité des appareils ; évaluation gratuite 14 jours (formulaire après « Démarrer »). Endpoints observés : aucun.
- **Backup** -> `../nav/rm/backup/welcome` : point de sauvegarde à distance ; licence payante, essai 14 jours. Endpoints observés : `/Backup/RequestBackupDeviceList`.

### ASSIST AR

**Aperçu** -> `../nav/augmented-reality/overview`
- Demander une session via code QR (payant)
- Rapport de connexion pour les ID TeamViewer -> `../nav/buddies/g/0/list`
- Rapport de connexion pour les codes de session -> `../nav/servicequeue/report`
- Création de termes et conditions personnalisés -> `../nav/deploy/modules`
- Boutique et actualités -> `teamviewer.com`
- Endpoints observés (clic sur « Visualiser » > Rapport de connexion pour les ID) :
  - `/ManagedDeviceReports/ReportManagedDeviceCount` (nouveau endpoint)
  - `/LicenseLimit/GetLicenseLimitInformation`
  - `/UserSettings/Get`
- Remarque : réutilisation de routes déjà cartographiées ailleurs — « Rapport de connexion pour les ID » -> `../nav/buddies/g/0/list` (identique à GROUPES / GetBuddies) ; « Termes et conditions » -> `../nav/deploy/modules` (identique à ACCUEIL). L'application réutilise les mêmes briques sous des libellés différents : un IDOR sur ces routes serait le même quel que soit le point d'entrée, pas besoin de re-tester via Assist AR.

### GROUPES D'APPAREILS

**Tout** : visualisation des périphériques et rapports de connexion -> `../nav/manageddevicev2/mydevices/<list | sessions>`
- Onglet Périphériques : liste les appareils du groupe, filtre (Tout / Mes appareils gérés) et barre de recherche -> `.../mydevices/list` (groupe vide sur le compte de test)
- Onglet Rapports de connexion : « Droits insuffisants — vous n'avez pas les droits requis pour visualiser le Rapport de connexion » -> `.../mydevices/sessions`
- Remarque (SPA) : cliquer sur un onglet ne déclenche aucun appel (navigation JS côté client) ; c'est le rechargement (F5) qui réinitialise l'appli et redemande tout au serveur d'un coup.
- Endpoints observés (au rechargement de `/nav/manageddevicev2/mydevices/`) :
  - Candidats contrôle d'accès à inspecter :
    - `/Account/GetAccount` (~4020 o — infos complètes du compte, candidat sur-exposition de données / OWASP API3)
    - `/ManagedDeviceV2/GetPagedManagedDevices` (Params ✓ — envoie des paramètres, probablement pagination/ID)
    - `/ComputerAndContacts/GetGroups` (~1395 o — liste de groupes avec leurs IDs)
    - `/SessionCode/List`, `/SessionCode/ListGroups` (codes de session = objets avec IDs)
    - `/ManagedDeviceV2/GetSessionManagement`, `/ManagedDeviceV2/GetAllManagedGroups`
    - `/Management/GetConfigurationData`, `/Management/GetLicenseDetails`, `/Management/GetUnpaidLicenseInfo`
    - `/CustomModules/Read` (~2155 o)
    - `/TrustManagement/GetPagingCount`
  - Bruit / déjà connus (non pertinents IDOR) : `/Flume/View`, `/Update/WaitForUpdate`, `/UserSettings/Get`, `/ComputerAndContacts/GetBuddies`, `/IdentityProvider/GetOsInformation*`

### GROUPES

**Tout** : visualiser tous les appareils et contacts de tous les groupes -> `../nav/buddies/g/0/<list | sessions>`
- Deux onglets : Ordinateurs et contacts / Rapports de connexion
- Onglet Ordinateurs et contacts -> `.../g/0/list` : ajouter/modifier/supprimer ordinateurs, contacts et groupes ; filtre « Afficher uniquement les appareils gérés » ; options d'affichage (Statut/Politique/Services) ; barre de recherche ; déplacement d'un appareil vers un groupe
- Onglet Rapports de connexion -> `.../g/0/sessions` : payant (essai 14 j)
- Endpoints observés :
  - Lecture (déjà vus) : `/LicenseLimit/GetLicenseLimitInformation`, `/ManagedDeviceReports/ReportManagedDeviceCount`
  - Écriture / actions (prennent un ID d'objet en entrée) :
    - `/Management/MoveToGroup` (déplacer un appareil vers un groupe)
    - `/Management/GetAdditionalBuddyDetails` (consulter les propriétés d'un ordinateur)
    - `/Management/CreateComputer` (créer un ordinateur)
    - `/Management/UpdateComputer` (modifier les propriétés d'un ordinateur)
    - `/ManagedDevice/AssignManagerToDevice` (assigner un appareil à un compte)
    - `/Management/CreateContact` (ajouter un contact)
    - `/ComputerAndContacts/UpdateOrCreateGroupDetails` (créer/modifier un groupe)
    - `/Management/DeleteBuddy` (supprimer un ordinateur)
- Remarques :
  - Les groupes sont identifiés par un ID numérique visible dans l'URL (`g/<id>/list`) : My computers = 374110107, Unknown = 374110211 (écart 104). Candidat IDOR N°1 : tester l'accès à un ID de groupe voisin n'appartenant pas au compte.
  - Les endpoints d'écriture ci-dessus manipulent des objets par ID.
  - Création de groupe échoue : « An unexpected error occurred: mWNLCvSpYTf-3-3-66-C2r » (même format d'erreur « soft » -3-3-66- déjà vu sur GetCompanyList / LicenseLimit : pattern d'erreur applicatif maison, code HTTP 200).
  - Ajout de contact indisponible (un seul compte créé lors de la cartographie).

**My computers** -> `../nav/buddies/g/374110107/<list | sessions>` : mêmes fonctions et endpoints que l'onglet « Tout ».

**Unknown** -> `../nav/buddies/g/374110211/<list | sessions>` : mêmes fonctions et endpoints que l'onglet « Tout ».

### RÉGLAGES DE PROFIL (menu compte « pjtbb » en haut à droite)

Paramètres du compte utilisateur :
- **Général** : infos générales modifiables (nom, email, langue) -> `../nav/profile/general`
- **Avancé** : QuickSupport/QuickJoin, rapports de connexion, notifications -> `../nav/profile/advanced`
- **Sécurité** : mot de passe, Zero-Knowledge recovery, 2FA -> `../nav/profile/security`
- **Licence** : consulter/activer la licence (compte Free) -> `../nav/profile/license`
- **Applications** : apps et scripts accédant au compte ; boutons « Créer une app » / « Créer un jeton de script » -> `../nav/profile/apps`
- **Connexions actives** : historique des connexions au compte (date, lieu, appareil) -> `../nav/profile/active-logins`
- **Appareils de confiance** : gérer appareils + @IP de confiance, révoquer -> `../nav/profile/trust-management`
- **Paramètres navigateur** : réglages par navigateur (vide) -> `../nav/profile/browser-settings`
- Boutons globaux : « Sauvegarder » et « Supprimer le compte »

Endpoints observés :
- À l'ouverture des réglages : `/UserManagement/ReadAdditionalProfileData`, `/UserManagement/GetAccountDevicesRestrictionFlag`
- Section Applications : `/ManageApi/GetRegisteredApplicationList` (apps enregistrées), `/MobileSdk/GetAllTokens` (jetons du compte — données sensibles)
- Section Connexions actives : `/Management/ActiveLoginsRead` (sessions actives : lieu, appareil)
- Activation 2FA : `/Tfa/RequestTfaActivation`
- À la sauvegarde : `/UserManagement/UpdateProfile` (écriture profil — candidat mass assignment), `/UserManagement/SetTrustDeviceViaPush`

Remarques :
- Zone à fort enjeu : jetons d'API/script et apps liées au compte. Un défaut de contrôle d'accès sur `GetAllTokens` ou `GetRegisteredApplicationList` exposerait des secrets d'authentification -> candidat prioritaire (données sensibles).
- `/UserManagement/UpdateProfile` : écriture -> tester l'injection de champs non prévus (mass assignment, ex. `role`, `isAdmin`) lors de la sauvegarde.
