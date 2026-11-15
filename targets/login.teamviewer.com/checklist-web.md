# Checklist web — login.teamviewer.com

Coche au fur et à mesure. Une case non cochée = zone **non testée**, pas zone saine.

> Périmètre de ce travail : classe de vulnérabilité unique = **contrôle d'accès**
> (IDOR + attribution de masse). Les sections hors de cette classe (injections, XSS,
> logique métier, côté serveur…) sont volontairement **non testées** et laissées
> décochées — conformément à la consigne « une seule cible, une seule classe ».

## Reconnaissance applicative
- [x] Technologies identifiées (serveur, framework, CDN, WAF) — ASP.NET, Cloudflare, console SPA (voir `fiche.md`)
- [ ] Fichiers JS téléchargés et lus (endpoints, clés, feature flags, commentaires) — identifié comme piste (non fait)
- [ ] `robots.txt`, `sitemap.xml`, `.well-known/`, `/swagger`, `/graphql`, `/actuator`
- [ ] Sous-domaines et environnements annexes (dev, staging, preprod, uat) — hors périmètre (scope strict aux 3 domaines)
- [ ] Répertoires exposés : `.git/`, `.env`, `backup/`, `.DS_Store`, dumps SQL
- [x] Messages d'erreur verbeux, stack traces, pages de debug — observé : pattern « soft error » (HTTP 200 + code `xxx-3-3-66-xxx` dans le corps JSON), pas de stack trace

## Authentification
*(hors classe choisie — non testé ; observations seulement)*
- [ ] Énumération d'utilisateurs (messages ou temps de réponse différents)
- [ ] Politique de mot de passe, verrouillage, rate limiting sur le login
- [ ] Reset de mot de passe : token prévisible, non expiré, réutilisable, fuite via Referer/Host header
- [ ] MFA : contournable, code brute-forçable, non exigé sur certains flux — 2FA présent, non testé
- [ ] OAuth / SSO : `redirect_uri` laxiste, `state` absent, fuite de code, account linking abusif — `redirect_uri` observé sur `account.`, noté comme piste open redirect, non testé
- [ ] JWT : `alg: none`, HS/RS confusion, signature non vérifiée, clé faible, absence d'expiration — jeton `anx-pow-auth` observé, non analysé

## Session
*(non testé — cookies observés mais attributs non vérifiés)*
- [ ] Attributs des cookies (`HttpOnly`, `Secure`, `SameSite`)
- [ ] Session non invalidée à la déconnexion / au changement de mot de passe
- [ ] Session fixation
- [ ] Plusieurs sessions concurrentes non révoquées

## Contrôle d'accès — le plus rentable *(classe ciblée)*
- [x] IDOR : remplacer un identifiant par celui d'un autre compte (2 comptes de test créés) — `GetAdditionalBuddyDetails` rejoué avec le `buddyId` du compte B depuis la session de A -> refus `"s":0`. **Négatif conclusif.**
- [x] Élévation verticale : appeler un endpoint admin avec un compte utilisateur — *(partiel)* `/SuperUser/GetCompanyList` appelé par un compte gratuit -> refus `"s":0` ; endpoint des rapports de connexion non retrouvé côté serveur
- [x] Élévation horizontale entre tenants / organisations — couverte par le test IDOR à 2 comptes (accès inter-comptes refusé)
- [x] Contrôle uniquement côté client (bouton caché mais endpoint ouvert) — **identifié** : le refus « Droits insuffisants » des rapports de connexion est calculé côté client (endpoint serveur réel non retrouvé — piste)
- [ ] Changement de méthode HTTP (`GET`→`POST`, `PUT`, `PATCH`, `DELETE`) — non testé
- [ ] Contournement de chemin : `//admin`, `/admin/.`, `%2e%2e`, casse, encodage — non testé
- [x] *(hors liste)* Attribution de masse (property-level, OWASP API3) — `/UserManagement/UpdateProfile` : injection de `AccountType`/`IsAdmin`/`CompanyId` -> `"s":1` mais aucun champ persisté (vérifié via `/Account/GetAccount`). **Négatif.**

## Injections
*(hors classe — non testé)*
- [ ] SQL / NoSQL (paramètres, en-têtes, JSON, ordre de tri, filtres)
- [ ] Injection de commandes OS
- [ ] Injection de template côté serveur (SSTI)
- [ ] LDAP, XPath, injection d'en-têtes / CRLF
- [ ] Désérialisation non sécurisée

## XSS et injections côté client
*(hors classe — non testé)*
- [ ] Réfléchie, stockée, DOM-based (`innerHTML`, `location.hash`, `postMessage`)
- [ ] Contournement de la CSP / absence de CSP
- [ ] Upload de fichier rendu en HTML ou SVG
- [ ] `target=_blank` sans `noopener`, open redirect chaînable — `redirect_uri` noté sur `account.`, non testé

## Logique métier
*(hors classe — non testé)*
- [ ] Manipulation du prix, de la quantité, de la devise, d'une remise
- [ ] Étapes d'un tunnel sautées ou rejouées
- [ ] Valeurs négatives, très grandes, décimales, unicode
- [ ] Race conditions (double dépense, double usage d'un coupon)
- [ ] Absence de rate limit sur une action coûteuse (SMS, e-mail, export)

## Côté serveur
*(hors classe — non testé)*
- [ ] SSRF (webhooks, import d'URL, génération de PDF, prévisualisation de lien)
- [ ] Inclusion / traversée de fichiers
- [ ] XXE (XML, DOCX, SVG, SOAP)
- [ ] Upload : type, extension double, magic bytes, chemin d'écriture, exécution
- [ ] Request smuggling, empoisonnement de cache, cache d'en-têtes

## Configuration
- [ ] CORS permissif (`Access-Control-Allow-Origin` reflété + `credentials: true`) — non testé
- [x] En-têtes de sécurité (HSTS, `X-Content-Type-Options`, `Content-Security-Policy`) — observés : HSTS `max-age=31536000`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` ; CSP non observée
- [ ] Prise de contrôle de sous-domaine (CNAME orphelin) — hors périmètre
- [ ] Identifiants par défaut sur les interfaces d'admin — non testé
- [ ] Versions vulnérables connues (CVE) confirmées manuellement — non testé

## Avant de rapporter
- [x] Reproduit deux fois, depuis une session propre — tests rejoués en Repeater
- [ ] Impact métier formulé en une phrase — N/A (aucune vulnérabilité confirmée), mais démarche suivie
- [x] Preuves caviardées et horodatées — captures floutées (cookies / jetons masqués)
- [x] Vérifié hors de la liste des vulnérabilités exclues du programme — périmètre vérifié (3 domaines autorisés)
