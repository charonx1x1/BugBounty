# Investigation SQLi — Authentification TeamViewer

**Date :** 14 novembre 2026  
**Cible :** `https://login.teamviewer.com/LogOn/Authenticate`  
**Méthode :** POST, JSON  
**Paramètre étudié :** `UserName`  
**Outil :** sqlmap 1.10.11#pip  
**Résultat :** aucune injection SQL confirmée dans les conditions de mes tests

## 1. Objectif

J'ai étudié le comportement du point d'authentification TeamViewer face à des tests d'injection SQL portant sur le paramètre JSON `UserName`. J'ai cherché à distinguer les résultats liés à la détection SQLi des réponses de contrôle d'accès et des mécanismes de limitation du trafic.

Je n'ai pas inclus dans ce document les valeurs de cookies, les mots de passe, les jetons SSO ni les réponses CAPTCHA présents dans certaines captures.

## 2. Méthode et chronologie

J'ai effectué plusieurs observations dans le cadre de mon investigation. La première série a mis en évidence une réponse HTTP 429 et des alertes heuristiques de sqlmap ; j'ai ensuite réalisé deux exécutions dont j'ai conservé les sorties terminal.

### 2.1. Observation préalable — 22:38 à 22:47

Les extraits suivants proviennent de mon journal terminal :

```text
[22:38:52] [WARNING] target appears to be rate-limiting requests; sqlmap is backing off and throttling accordingly
[22:40:28] [WARNING] the web server responded with an HTTP error code (429) which could interfere with the results of the tests
[22:41:09] [CRITICAL] heuristics detected that the target is protected by some kind of WAF/IPS
[22:41:41] [CRITICAL] connection timed out to the target URL. sqlmap is going to retry the request(s)
[22:45:31] [WARNING] heuristic (basic) test shows that (custom) POST parameter 'JSON UserName' might not be SQL injectable
[22:47:51] [INFO] testing for SQL injection on (custom) POST parameter 'JSON UserName'
```

J'ai constaté un HTTP 429 rapporté par sqlmap, des retards de connexion et une indication heuristique de WAF/IPS. Ces lignes ne permettent pas d'identifier un produit WAF ni de confirmer une injection SQL.

### 2.2. Scan n° 1 — requête enregistrée, 23:29:59 à 23:41:36

J'ai utilisé le fichier HTTP `request1.txt`, contenant la structure de ma requête POST JSON. Le scan était configuré avec `--level=5` et `--risk=3`, en ciblant `UserName`.

**Preuves — extraits expurgés :**

```text
[23:30:00] [INFO] parsing HTTP request from 'request1.txt'
JSON data found in POST body. Do you want to process it? [Y/n/q] Y
[23:30:01] [INFO] testing connection to the target URL
got a 301 redirect to 'https://login.teamviewer.com/LogOn/Authenticate'
[23:30:31] [CRITICAL] previous heuristics detected that the target is protected by some kind of WAF/IPS
[23:31:01] [WARNING] target appears to be rate-limiting requests; sqlmap is backing off and throttling accordingly
[23:34:49] [WARNING] heuristic (basic) test shows that (custom) POST parameter 'JSON UserName' might not be SQL injectable
[23:37:37] [INFO] testing for SQL injection on (custom) POST parameter 'JSON UserName'
[23:41:28] [WARNING] user aborted during detection phase
[23:41:36] [WARNING] HTTP error codes detected during run:
429 (Too Many Requests) - 16 times, 403 (Forbidden) - 14 times
```

**Bilan :** j'ai interrompu ce scan pendant la détection. sqlmap a signalé **16 réponses HTTP 429** et **14 réponses HTTP 403**. Je ne peux donc pas tirer de conclusion définitive sur l'injectabilité à partir de ce premier scan.

### 2.3. Scan n° 2 — paramètres JSON, 23:43:00 à 23:53:54

J'ai effectué une deuxième exécution avec une requête POST au format JSON simplifié et des identifiants fictifs (`alice`, `demo123`), en ciblant `UserName` avec `--level=1` et `--risk=1`. Cette requête simplifiée ne reproduit pas tous les champs de vérification SSO/CAPTCHA de la requête navigateur.

**Preuves — extraits expurgés :**

```text
[23:43:00] [WARNING] the web server responded with an HTTP error code (403) which could interfere with the results of the tests
[23:43:00] [CRITICAL] previous heuristics detected that the target is protected by some kind of WAF/IPS
[23:43:00] [WARNING] target URL content is not stable (i.e. content differs)
[23:43:01] [WARNING] heuristic (basic) test shows that (custom) POST parameter 'JSON UserName' might not be SQL injectable
[23:44:03] [WARNING] target appears to be rate-limiting requests; sqlmap is backing off and throttling accordingly
[23:45:23] [CRITICAL] considerable lagging has been detected in connection response(s).
[23:53:54] [WARNING] (custom) POST parameter 'JSON UserName' does not seem to be injectable
[23:53:54] [CRITICAL] all tested parameters do not appear to be injectable.
[23:53:54] [WARNING] HTTP error codes detected during run:
403 (Forbidden) - 142 times, 429 (Too Many Requests) - 9 times
```

**Bilan :** le scan s'est terminé sans résultat positif. sqlmap a signalé **142 réponses HTTP 403** et **9 réponses HTTP 429**. L'instabilité des pages, les refus et la latence limitent la portée de son résultat négatif.

## 3. Comparatif

| Élément | Scan n° 1 | Scan n° 2 |
| --- | --- | --- |
| Requête | Fichier HTTP enregistré | POST JSON simplifié |
| Niveau / risque | 5 / 3 | 1 / 1 |
| État final | Interrompu par l'utilisateur | Terminé |
| HTTP 403 signalés | 14 | 142 |
| HTTP 429 signalés | 16 | 9 |
| Injection SQL confirmée | Non | Non |

Les comptages correspondent aux messages de synthèse de sqlmap ; ils ne constituent pas nécessairement un décompte exhaustif de toutes les requêtes réseau.

## 4. Analyse

J'ai confirmé, à partir des sorties terminal, que sqlmap a reçu des réponses **403 Forbidden** et **429 Too Many Requests**. Le code 429 constitue un indice direct de limitation des requêtes. La présence d'un WAF/IPS reste une **détection heuristique de l'outil** : je n'ai pas identifié indépendamment un produit ou une règle WAF.

Le second scan a exploré plusieurs techniques SQLi (booléenne, fondée sur les erreurs, requêtes empilées, temporelle et UNION). Les libellés `testing` désignent des tentatives de détection, non des exécutions SQL réussies. Les délais observés ne peuvent pas être attribués à une SQLi temporelle, puisque les réponses étaient déjà instables et ralenties.

Le test final indique `all tested parameters do not appear to be injectable`. J'interprète ce résultat strictement : **aucune injection n'a été détectée dans ces conditions**. Il ne prouve pas l'absence absolue de vulnérabilité.

## 5. Conclusion

**Je n'ai pas confirmé de vulnérabilité SQLi sur `UserName`.** Mon investigation a surtout mis en évidence des refus HTTP 403, des réponses HTTP 429 et des perturbations de la comparaison automatisée des réponses. Le premier scan a été interrompu, et le second s'est terminé sans détection positive.

Je classe donc ce résultat comme **investigation SQLi non concluante quant à l'absence de vulnérabilité, avec aucun cas exploitable démontré**. Je ne lui attribue pas de score CVSS : aucun impact de sécurité n'a été établi.

## 6. Limites et conservation des preuves

- Les extraits ci-dessus proviennent de mes sorties terminal sqlmap ; ils ne remplacent pas des captures brutes des réponses HTTP.
- Je ne dispose pas dans ces preuves des en-têtes ou du corps complets des réponses 403/429.
- Le fichier `log` de sortie sqlmap examiné était vide ; le fichier `session.sqlite` ne contenait que deux petits enregistrements et n'apportait pas de réponse HTTP brute.
- J'ai volontairement supprimé de cette documentation toutes les valeurs d'authentification et de session.
- Pour toute réutilisation ou publication de captures, je masque les identifiants, mots de passe, cookies et jetons.

**Source de preuve :** sorties terminal de mes scans du 14 novembre 2026, recopiées et expurgées ci-dessus.
