# Fiche cible — web.teamviewer.com

- **Programme** : TeamViewer - Bounty Program
- **Policy** : https://yeswehack.com/programs/teamviewer-bounty-program
- **Dans le périmètre** : Oui (vérifié le 2026-11-11)
- **Débit autorisé** : Aucun seuil chiffré précisé dans la politique publique. Limiter les requêtes et éviter les outils automatisés.
- **En-tête d'identification exigé** : Aucun indiqué dans la politique publique.


## Technologies

| Couche | Détail |
|---|---|
| Serveur | |
| Framework | |
| CDN / WAF | |
| Auth | <session, JWT, OAuth, SAML> |
| API | <REST, GraphQL, gRPC> |

## Comptes de test

| Rôle | Identifiant | Notes |
|---|---|---|
| Utilisateur A (attaquant) | | |
| Utilisateur B (victime) | | |
| Admin (si fourni) | | |

## Surface d'attaque

| Fonctionnalité | Intérêt | Testée | Notes |
|---|---|---|---|
| Inscription / login | | ☐ | |
| Reset mot de passe | | ☐ | |
| Profil / upload | | ☐ | |
| Paiement / facturation | | ☐ | |
| Partage / permissions | | ☐ | |
| Import par URL / webhook | | ☐ | |
| Export / rapports | | ☐ | |
| Espace admin | | ☐ | |

## Identifiants d'objets observés

<Format des ids : incrémental, UUID, hash — déterminant pour les tests d'IDOR>

## Pistes à creuser

- [ ]
- [ ]

## Écarté (et pourquoi)

- <endpoint> : <raison — évite de le retester dans un mois>

## Cartographie de l'authentification

### Application
- Application web pilotée par JavaScript (SPA probable).
- Service de connexion : account.teamviewer.com.
- Retour prévu vers /authenticate/withtoken.

### API observée
Endpoint : GET /api/account/v1/account

Avant authentification :
- HTTP 401 Unauthorized
- Corps vide
- En-tête Tv-Wps-Api-Auth-Failure observé

Après authentification :
- HTTP 200 OK
- Réponse JSON contenant les informations du compte.

### Structure JSON observée
- accountId : identifiant numérique
- profile : informations et préférences
- accountCompanyInfo : appartenance à une entreprise
- effectiveLicenseFeatures : fonctionnalités de licence
- loginType : type de connexion
- accountType : type de compte

### Hypothèses à étudier
- Vérification des contrôles d'accès aux ressources.
- Compréhension du mécanisme de session.

### Conclusion provisoire
L'API exige une authentification valide pour
retourner les informations du compte.

Aucune vulnérabilité confirmée à ce stade.
