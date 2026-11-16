# Fiche cible : web.teamviewer.com

## Programme et périmètre

- **Programme :** TeamViewer Bounty Program (YesWeHack)
- **Politique :** https://yeswehack.com/programs/teamviewer-bounty-program
- **Cible principale de cette investigation :** `web.teamviewer.com`
- **Service rencontré pendant l'authentification :** `account.teamviewer.com`
- **Périmètre :** vérifié lors de la préparation des tests. Consulter la politique officielle avant toute nouvelle investigation.
- **Débit autorisé :** aucun seuil numérique relevé dans la politique consultée. Tests manuels à faible fréquence, sans scan agressif.
- **En-tête d'identification :** aucune obligation particulière relevée lors de la lecture de la politique.
- **Précautions :** utiliser exclusivement les comptes créés pour le projet et les ressources qui leur appartiennent ; ne pas tester les sous-domaines révélés par les certificats sans vérifier leur autorisation.

## Technologies et architecture observées

| Couche | Observations |
|---|---|
| Application web | Interface JavaScript de type SPA ; framework non identifié avec certitude |
| Authentification | Redirection vers `account.teamviewer.com`, puis retour vers `/authenticate/withtoken` |
| API | Endpoints HTTP avec réponses JSON, de type REST |
| Ressources front-end | Fichiers JavaScript servis notamment depuis `static.web.teamviewer.com` (observés dans le navigateur, pas testés séparément) |
| Serveur et infrastructure | Technologies précises non déterminées ; en-têtes de sécurité et `X-Azure-Ref` observés |
| CDN / WAF | Non identifié de manière certaine |

## Comptes de test

| Compte | Utilisation | Précautions |
|---|---|---|
| `testBB` | Compte A, propriétaire des fiches examinées | Identifiants, e-mail et cookies non publiés |
| `testBB2` | Compte B, comparaison des permissions | Identifiants, e-mail et cookies non publiés |

Deux comptes indépendants ont permis de comparer les réponses aux mêmes opérations sur une fiche appartenant au compte A. Les anciennes adresses e-mail temporaires ont posé des problèmes de vérification ; l'adresse du premier compte a ensuite été modifiée.

## Surface fonctionnelle explorée

| Fonctionnalité | Niveau d'exploration | Observations |
|---|---|---|
| Connexion et session | Observée | `GET /api/account/v1/account` : 401 sans authentification, 200 après connexion |
| Contacts et invitations | Analysée | Invitation initialement en erreur 500, puis création avec 201 et acceptation depuis l'autre compte |
| Contacts personnels | Tests ciblés | Vérifications GET, PUT et DELETE avec deux comptes |
| Profil utilisateur | Tests ciblés | Modification du nom ; essai sur une propriété `ReadOnly` |
| Confidentialité du profil | Exploration limitée | `isOnlyVisibleForPartners` modifiable ; test de visibilité non concluant |
| Appareils et groupes | Cartographiée | Aucun appareil géré disponible ; fonctionnalités avancées limitées par la licence |
| Réinitialisation du mot de passe | Non testée | Hors de l'axe retenu |
| Paiement, facturation et espace administrateur | Non testés | Non étudiés dans cette investigation |

## API observées

| Méthode et chemin | Observation |
|---|---|
| `GET /api/account/v1/account` | 401 sans session ; 200 avec session |
| `GET /api/manageddevices/v2/me` | Informations de gestion liées au compte |
| `GET /api/legacydevices/v1/groups` | Groupes personnels retournés |
| `POST /api/manageddevices/v2/devices/filter` | 200 avec liste vide ; 500 pour une requête réduite |
| `POST /api/contacts/v1/personal/invitations` | Échec initial 500 ; réussite ultérieure 201 |
| `GET /api/contacts/v1/personal` | Liste des contacts personnels |
| `GET /api/contacts/v1/personal/{personalContactId}` | Test de lecture entre comptes |
| `PUT /api/contacts/v1/personal/{personalContactId}` | Test de modification entre comptes |
| `DELETE /api/contacts/v1/personal/{personalContactId}` | Test de suppression entre comptes |
| `PATCH /api/account/v1/profile` | Nom, options du profil et restrictions de visibilité |

## Identifiants observés

- `accountId` : identifiant numérique d'un compte.
- `personalContactId` : identifiant numérique d'une fiche de contact personnel. Une fiche recréée peut obtenir un nouvel identifiant.
- `groupId` : identifiant numérique d'un groupe de contacts.
- `managerId` : identifiant au format UUID observé dans la gestion des appareils.

Les valeurs réelles ne sont pas reprises dans cette fiche pour éviter de publier des informations liées aux comptes de test.

## Résultats des tests de contrôle d'accès

### Lecture d'un contact : GET

- **Compte A, propriétaire :** 200 OK.
- **Compte B, non propriétaire :** 404 Not Found.
- **Observation :** aucune donnée de la fiche retournée au compte B.
- **Preuves :** `evidences/idor_contact_200.png`, `evidences/idor_contact_404.png`.

### Modification d'un contact : PUT

- **Compte A, propriétaire :** 200 OK ; note modifiée.
- **Compte B, non propriétaire :** 404 Not Found.
- **Vérification :** la note de la fiche du compte A est restée inchangée après la tentative du compte B.
- **Preuves :** `evidences/idor_put200.png`, `evidences/idor_put_404.png`.

### Suppression d'un contact : DELETE

- **Suppression normale par un propriétaire :** 204 No Content. Dans cet essai, la relation de contact a également disparu de l'autre compte.
- **Tentative du compte B sur une fiche existante du compte A :** 404 Not Found.
- **Vérification après tentative :** GET avec le compte A renvoie toujours 200 OK.
- **Preuves :** `evidences/idor_delete_204.png`, `evidences/idor_delete_404.png`.

**Bilan IDOR :** aucun accès, changement ou effacement non autorisé n'a été démontré sur les fiches personnelles testées. Ces résultats ne prouvent pas l'absence de vulnérabilité sur l'ensemble de TeamViewer.

## Autres essais et observations

### Propriété de profil déclarée ReadOnly

- `PATCH /api/account/v1/profile` avec modification de `displayName` : 200 OK.
- Tentative de modification de `enableSessionLogging` de `false` vers `true`, alors que la propriété est déclarée `ReadOnly` : 500 Internal Server Error.
- Nouvelle lecture du profil : `enableSessionLogging` est toujours `false`.
- **Conclusion :** modification non appliquée ; aucune vulnérabilité de contrôle des propriétés confirmée.
- **Preuve :** `evidences/profile_readonly_500.png`.

### Restriction de visibilité

- Activation de `isOnlyVisibleForPartners` depuis le compte A : 200 OK.
- Recherche du compte A depuis le compte B sans relation de contact : aucun résultat.
- **Limite :** la recherche ne permet pas de conclure directement à l'application ou au contournement de la restriction de visibilité.

### Erreurs HTTP 500

- Invitations : erreur initiale, puis opération fonctionnelle (201 Created).
- Filtrage des appareils : réponse 500 avec une requête contenant moins de paramètres ; cause exacte non isolée.
- Modification d'une propriété `ReadOnly` : réponse 500, mais valeur inchangée.
- **Conclusion :** anomalies observées, sans impact de sécurité confirmé.

## Pistes retenues et écartées

- **Piste principale étudiée :** contrôles d'accès sur les contacts personnels (lecture, modification et suppression).
- **Piste complémentaire :** contrôle des propriétés du profil déclarées non modifiables.
- **Non approfondi :** groupes et appareils avancés (fonctionnalités limitées ou absence d'appareils de test).
- **Non concluant :** visibilité du statut hors contacts, faute de moyen fiable pour observer le statut d'un compte extérieur.
- **Non retenu comme vulnérabilité :** réponses 500 isolées, faute d'impact démontré.

## Preuves et traçabilité

- Reconnaissance : `evidences/scope.png`, `evidences/certificats_ct.png`, `evidences/dns.png`.
- Cartographie : `evidences/devices.png`, `evidences/api_devices.png`.
- Contacts : `evidences/contact_creation_201.png`, `evidences/contact_testBB2.png`.
- IDOR : captures `idor_contact_*`, `idor_put*` et `idor_delete_*` dans `evidences/`.
- Essai sur le profil : `evidences/profile_readonly_500.png`.
- Explications détaillées : `journal.md`.

**Résultat global :** aucune vulnérabilité exploitable confirmée sur les fonctionnalités testées. Les contrôles d'accès observés ont empêché les opérations non autorisées sur les fiches personnelles utilisées dans les essais.
