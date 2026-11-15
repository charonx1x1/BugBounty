# Fiche cible — login.teamviewer.com

- **Programme** : TeamViewer Bounty Program — https://yeswehack.com/programs/teamviewer-bounty-program
- **Dans le périmètre** : oui 
- **Débit autorisé** : tests manuels uniquement, pas d'outil automatisé, débit mesuré
- **En-tête d'identification exigé** : aucun en-tête spécifique relevé

## Technologies

| Couche | Détail |
|---|---|
| Serveur | ASP.NET (cookie `.ASPXAUTH`, endpoints `.aspx` : `/LogOn`, `/authorizedevice.aspx`) |
| Framework | Console web monopage (SPA) |
| CDN / WAF | Cloudflare (cookies `cf_clearance`, `__cf_bm`) |
| Auth | Session (`.ASPXAUTH`, `BrowserAuthToken`) + SSO (Google / Apple / Microsoft) + JWT (`anx-pow-auth`) |
| API | REST-like, POST JSON, enveloppe maison `{"d":<données>,"s":<statut>}` ; erreurs `{"s":0,"ec":"...","m":"..."}` en HTTP 200 |

## Comptes de test

| Rôle | Identifiant | Notes |
|---|---|---|
| Utilisateur A (attaquant) | Compte gratuit | Appareil `buddyId` 1675044640 |
| Utilisateur B (victime) | 2ᵉ compte gratuit | Appareil `buddyId` 1674851190 |


## Surface d'attaque

| Fonctionnalité | Intérêt | Testée | Notes |
|---|---|---|---|
| Inscription / login | Flux auth, SSO, `redirect_uri` | ☑ | Cartographié ; résolution par session |
| Reset mot de passe | — | ☐ | Vu, non testé (relève de l'authentification, hors classe contrôle d'accès) |
| Profil | Attribution de masse | ☑ | `UpdateProfile` : champs non reconnus ignorés (négatif) |
| Paiement / facturation | Fonctions payantes | ☐ | Inaccessibles (compte gratuit) |
| Partage / permissions | Groupes partagés (`CanShareGroups:true`) | ☐ | Piste non testée (nécessite 2 comptes) |
| Export / rapports | Rapports de connexion | ☑ (partiel) | « Droits insuffisants » calculé côté client — piste |
| Espace admin | `/SuperUser/GetCompanyList` | ☑ (partiel) | Refus applicatif `"s":0`, pas de 403 |
| Détails d'appareil | IDOR horizontal | ☑ | `GetAdditionalBuddyDetails` : testé à 2 comptes, accès refusé (négatif conclusif) |

## Identifiants d'objets observés

| Objet | Identifiant | Format | Devinable ? |
|---|---|---|---|
| Groupe de contacts | `GroupId` / URL `g/<id>` | numérique (374110107, 374110211) | Oui |
| Contact / appareil | `Id` / `buddyId` | numérique (1675044640) | Partiel |
| Appareil TeamViewer | `TeamViewerId` | numérique (6666888) | Oui (public) |
| Groupe d'appareils gérés | `ChainId` | GUID | Non |
| Compte | `AccountID` | numérique (335493449) | À confirmer |

Note : les endpoints de lecture de liste (`GetBuddies`, `GetAllManagedGroups`) ont un corps
de requête vide → le propriétaire est résolu par la **session**, pas par un identifiant client.

## Pistes à creuser

- [x] IDOR horizontal : `GetAdditionalBuddyDetails` rejoué avec l'identifiant d'un **second compte** (B) depuis la session de A → refus `"s":0` = contrôle d'accès confirmé (négatif conclusif).
- [ ] Rapports de connexion : le refus « Droits insuffisants » est calculé côté client → vérifier si l'endpoint serveur applique bien le contrôle d'accès.
- [ ] Analyse des bundles JS pour retrouver le nom de l'endpoint de rapports de connexion.

## Écarté (et pourquoi)

- `GetBuddies`, `GetAllManagedGroups` : corps vide, scopés par session → pas de surface IDOR.
- `GetAllTokens`, `GetRegisteredApplicationList` : corps vide → scopés session ; le second renvoie un catalogue global d'intégrations, pas de secret du compte.
- Reset mot de passe : hors classe de vulnérabilité choisie (authentification).
- Fonctions Remote Management (monitoring, backup…) : inaccessibles avec un compte gratuit.
