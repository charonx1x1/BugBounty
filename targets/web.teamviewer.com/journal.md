# Journal de bord : web.teamviewer.com

## Reconnaissance passive

**Cible étudiée :** `web.teamviewer.com`

### Travail effectué

J'ai commencé par une phase de reconnaissance passive afin de mieux comprendre l'environnement de TeamViewer avant d'effectuer des tests sur l'application.

J'ai principalement utilisé `crt.sh` pour consulter les certificats TLS publics et identifier les sous-domaines associés à la cible.

J'ai ensuite effectué des requêtes DNS avec `dig` pour récupérer les enregistrements IPv4 (A) et IPv6 (AAAA).

### Observations

- Plusieurs sous-domaines ont été identifiés à partir des certificats publics.
- La résolution DNS de `web.teamviewer.com` fonctionne en IPv4 et en IPv6.
- Certains sous-domaines semblent correspondre à d'anciens environnements ou à des services spécifiques.
- Les sous-domaines découverts n'ont pas été considérés comme automatiquement autorisés pour les tests.

La consultation des certificats a parfois été compliquée par l'indisponibilité de certains services, notamment `crt.sh`.

**Preuves :**
- `evidences/certificats_ct.png`
- `evidences/dns.png`
- `evidences/scope.png`

## Cartographie de l'application

**Périmètre étudié :** `web.teamviewer.com` et les fonctionnalités d'authentification associées à `account.teamviewer.com`.

### Analyse de l'authentification

J'ai utilisé Burp Suite pour observer les échanges HTTP entre le navigateur et les API TeamViewer.

Deux comptes dédiés aux tests ont été créés : `testBB` et `testBB2`. L'objectif était de pouvoir comparer les permissions entre deux utilisateurs indépendants.

Un des premiers endpoints étudiés a été :

`GET /api/account/v1/account`

Les réponses observées étaient les suivantes :

- Avant authentification : `401 Unauthorized`.
- Après authentification : `200 OK`, avec les informations du compte au format JSON.

Ce premier test a permis de constater que cet endpoint nécessite une session authentifiée.

### Exploration des API

En naviguant dans les différentes rubriques de TeamViewer, j'ai identifié plusieurs endpoints :

- `GET /api/manageddevices/v2/me` : informations liées à la gestion des appareils du compte.
- `GET /api/legacydevices/v1/groups` : récupération des groupes personnels.
- `POST /api/manageddevices/v2/devices/filter` : filtrage des appareils.

Sur l'API de filtrage des appareils, une requête complète a retourné `200 OK` avec une liste vide. Une requête contenant moins de paramètres a retourné `500 Internal Server Error`.

Il n'a pas été possible d'identifier précisément la cause de cette erreur. Aucun impact de sécurité n'a été démontré.

La gestion avancée des appareils et des groupes était également limitée par les fonctionnalités disponibles sur les comptes de test.

**Preuves :**
- `evidences/devices.png`
- `evidences/api_devices.png`

### Premiers essais sur les invitations

J'ai ensuite essayé d'ajouter un contact depuis un compte de test vers l'autre.

L'endpoint identifié était :

`POST /api/contacts/v1/personal/invitations`

Lors des premiers essais, le serveur retournait une erreur HTTP 500 et l'invitation n'aboutissait pas.

Après avoir repris les tests, l'envoi a fonctionné normalement. L'API a retourné `201 Created` et un objet JSON contenant notamment :

- `personalContactId`
- `accountId`
- `groupId`
- `ownership`

L'invitation a ensuite été reçue et acceptée depuis le second compte.

L'erreur HTTP 500 initiale n'a donc pas été retenue comme une vulnérabilité. Elle pouvait être liée à un problème temporaire du service ou à l'état des comptes.

**Preuve :**
- `evidences/contact_creation_201.png`

## Tests sur les contrôles d'accès

Pour cette séance, je me suis concentré sur les vulnérabilités de type IDOR (*Insecure Direct Object Reference*).

L'idée était de vérifier si un utilisateur authentifié pouvait consulter ou modifier des ressources appartenant à un autre compte en utilisant directement leurs identifiants.

Les tests ont été réalisés avec Burp Suite Repeater et uniquement avec nos deux comptes.

### 1. Consultation des contacts personnels (GET)

**Endpoint :**

`GET /api/contacts/v1/personal/{personalContactId}`

J'ai d'abord récupéré l'identifiant d'une fiche de contact existante depuis le compte `testBB`.

J'ai ensuite réutilisé cet identifiant dans une requête envoyée avec la session de `testBB2`.

**Résultats :**

| Compte | Code HTTP | Observation |
|---|---|---|
| `testBB` | 200 OK | Fiche accessible |
| `testBB2` | 404 Not Found | Fiche inaccessible |

Le serveur ne retournait aucune information du contact à l'utilisateur qui ne possédait pas cette fiche.

**Conclusion :** aucun accès non autorisé observé. Le contrôle d'accès semble correctement appliqué pour la consultation de cette ressource.

**Preuves :**
- `evidences/idor_contact_200.png`
- `evidences/idor_contact_404.png`

### 2. Modification des contacts personnels (PUT)

**Endpoint :**

`PUT /api/contacts/v1/personal/{personalContactId}`

J'ai commencé par modifier la note d'un contact depuis le compte propriétaire. La modification a été enregistrée avec un code `200 OK`.

J'ai ensuite repris la même opération depuis `testBB2`, en utilisant l'identifiant de la fiche appartenant à `testBB`.

**Résultats :**

- Modification depuis le compte propriétaire : `200 OK`.
- Tentative depuis le second compte : `404 Not Found`.

Pour vérifier que la réponse 404 correspondait bien à un refus effectif, j'ai relu la fiche depuis le compte propriétaire.

La note était restée inchangée.

**Conclusion :** aucune modification non autorisée observée.

**Preuves :**
- `evidences/idor_put200.png`
- `evidences/idor_put_404.png`

### 3. Suppression d'un contact (DELETE)

**Endpoint :**

`DELETE /api/contacts/v1/personal/{personalContactId}`

J'ai d'abord observé le fonctionnement normal de la suppression depuis l'interface TeamViewer.

La suppression d'un contact personnel a retourné `204 No Content`.

Après cette opération, la relation de contact n'apparaissait plus non plus dans l'autre compte. Ce comportement semble lié à la gestion des relations entre contacts, mais il n'a pas été identifié comme une faille.

J'ai ensuite créé une nouvelle fiche pour effectuer un test de suppression non autorisée.

La requête `DELETE` a été envoyée avec la session de `testBB2`, en ciblant l'identifiant d'une fiche appartenant à `testBB`.

**Résultats :**

- Tentative de suppression depuis `testBB2` : `404 Not Found`.
- Vérification de la fiche depuis `testBB` : `200 OK`.
- Le contact était toujours présent après la tentative.

**Conclusion :** aucune suppression non autorisée observée.

**Preuves :**
- `evidences/idor_delete_204.png`
- `evidences/idor_delete_404.png`
- `evidences/personal_contact_id_testBB.png`

### Bilan des tests IDOR

Les trois opérations principales ont été étudiées : consultation, modification et suppression.

Dans chaque cas, les tentatives réalisées depuis le compte non propriétaire ont retourné une erreur 404, tandis que les vérifications depuis le compte propriétaire ont confirmé que les ressources restaient accessibles et inchangées.

Aucune vulnérabilité IDOR n'a été identifiée sur les endpoints testés.

## Tests complémentaires sur le profil

### 1. Modification d'une propriété en lecture seule

**Endpoint :**

`PATCH /api/account/v1/profile`

En modifiant le nom d'affichage depuis l'interface, j'ai constaté que l'API acceptait la modification avec un code `200 OK`.

La réponse contenait plusieurs propriétés accompagnées d'un attribut indiquant leur mode d'accès, notamment `ReadWrite` ou `ReadOnly`.

J'ai donc voulu vérifier si une propriété indiquée comme non modifiable pouvait quand même être changée en envoyant directement une requête HTTP.

Le champ testé était `enableSessionLogging`, dont la valeur initiale était `false` et le mode `ReadOnly`.

**Test effectué :**

```json
{
  "enableSessionLogging": true
}
```

Le serveur a retourné `500 Internal Server Error`.

J'ai ensuite consulté à nouveau les informations du compte avec :

`GET /api/account/v1/account`

La valeur de `enableSessionLogging` était toujours `false`.

**Conclusion :** la modification n'a pas été appliquée. L'erreur HTTP 500 montre une gestion peu explicite de cette requête, mais aucun contournement des restrictions n'a été confirmé.

**Preuve :**
- `evidences/profile_readonly_500.png`

### 2. Restrictions de visibilité du profil

J'ai également examiné l'option *Status and messaging restrictions*, qui permet de limiter la visibilité du statut et les possibilités de messagerie.

L'activation de cette option déclenche une requête :

`PATCH /api/account/v1/profile`

Avec le paramètre :

```json
{
  "isOnlyVisibleForPartners": true
}
```

Le serveur a répondu `200 OK`.

Pour étudier son fonctionnement, j'ai utilisé le second compte, qui ne possédait alors aucun contact.

La recherche du premier compte par adresse e-mail ne retournait aucun résultat.

Cependant, cette observation ne permet pas de confirmer que la restriction est correctement appliquée, car le fonctionnement de la recherche par e-mail n'a pas été établi.

**Conclusion :** test non concluant. Aucun contournement de la restriction n'a été observé.

## Bilan de l'investigation

Cette investigation a permis de mieux comprendre le fonctionnement des API TeamViewer, notamment les mécanismes d'authentification, la gestion des contacts et les contrôles d'accès.

La partie la plus approfondie concerne les tests IDOR réalisés avec deux comptes indépendants.

Les opérations GET, PUT et DELETE ont permis de vérifier plusieurs scénarios d'accès à des ressources appartenant à un autre utilisateur.

Les contrôles testés ont empêché les accès et modifications non autorisés.

Quelques erreurs HTTP 500 ont également été rencontrées, mais aucun impact de sécurité n'a pu être démontré.

**Aucune vulnérabilité exploitable n'a été confirmée dans le périmètre et les fonctionnalités étudiés.**

La prochaine étape du projet consiste à exploiter les observations et les preuves conservées dans ce dépôt pour rédiger le rapport universitaire.
