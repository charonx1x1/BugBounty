
# Journal de bord — web.teamviewer.com

## 2026-11-11 — Reconnaissance passive

**Périmètre du jour**
- web.teamviewer.com

**Fait**
- Analyse des certificats TLS avec crt.sh.
- Identification des noms de domaines historiques.
- Analyse DNS des enregistrements A et AAAA.

**Observations**
- Plusieurs sous-domaines découverts via les journaux CT.
- Résolution IPv4 et IPv6 confirmée.
- Aucun test actif réalisé.

**Impasses**
- Indisponibilité temporaire de crt.sh et crtlog.

**Prochaine étape**
- Cartographie de l'application web.

## 2026-11-12 — Cartographie applicative

**Périmètre du jour**
- web.teamviewer.com
- account.teamviewer.com

**Fait**
- Analyse du parcours d'authentification.
- Création de deux comptes de test : testBB et testBB2.
- Observation des API Account et Devices.
- Exploration des groupes et des contacts.

**Observations**
- GET /api/account/v1/account :
  401 avant authentification, 200 après.
- GET /api/manageddevices/v2/me :
  informations de gestion du compte.
- GET /api/legacydevices/v1/groups :
  groupe personnel identifié.
- POST /api/contacts/v1/personal/invitations :
  erreur HTTP 500 lors du premier essai.
- POST /api/manageddevices/v2/devices/filter :
  réponse 200 avec liste vide pour une requête
  complète, et erreur 500 pour une requête réduite.

**Impasses**
- Invitations entre les deux comptes non abouties.
- Gestion avancée des groupes limitée par la licence.
- Aucun impact de sécurité démontré pour les erreurs 500.

**Prochaine étape**
- Identifier une fonctionnalité accessible permettant
  d'étudier les contrôles d'accès entre comptes de test.
