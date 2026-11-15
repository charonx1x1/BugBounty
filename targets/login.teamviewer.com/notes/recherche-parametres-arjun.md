# Recherche de paramètres cachés avec Arjun — TeamViewer

**Date :** 15 novembre 2026  
**Cible :** `https://login.teamviewer.com/LogOn/Authenticate`  
**Outil :** Arjun 2.2.7  
**Statut :** aucun paramètre caché confirmé

## 1. Objectif

J'ai utilisé Arjun dans le cadre de mon investigation de l'authentification TeamViewer pour rechercher des noms de paramètres HTTP qui ne seraient pas visibles directement dans le formulaire. J'ai ensuite comparé les noms remontés avec les champs de challenge déjà observés dans mes captures.

## 2. Test réalisé et preuve

Commande exécutée :

```bash
arjun -u "https://login.teamviewer.com/LogOn/Authenticate"
```

Extrait de la sortie terminal :

```text
(  |/ /(//) v2.2.7
[*] Scanning 0/1: https://login.teamviewer.com/LogOn/Authenticate
[*] Probing the target for stability
[*] Analysing HTTP response for anomalies
[+] Extracted 6 parameters from response for testing: policyRuleHash, method, randomData, id, algorithm, issuedAt
[*] Logicforcing the URL endpoint
[!] No parameters were discovered.
```

**Résultat direct :** Arjun a extrait six *noms candidats* de la réponse HTTP, mais n'a confirmé aucun paramètre caché utilisable dans l'endpoint.

## 3. Comparaison avec les données de challenge déjà relevées

J'ai rapproché les six noms d'éléments visibles dans les échanges précédents, notamment le cookie `anx-pow-auth` contenant une structure JWT et les réponses de vérification anti-automatisation.

| Nom remonté par Arjun | Correspondance observée ou possible | Niveau de certitude |
| --- | --- | --- |
| `policyRuleHash` | Le champ `policyRuleHash` apparaît dans les données décodées du JWT `anx-pow-auth` partagé précédemment. | Correspondance de nom dans un jeton déjà observé |
| `method` | Le champ `method` apparaît également dans ce JWT. | Correspondance de nom dans un jeton déjà observé |
| `randomData` | Aucune correspondance littérale établie à partir des extraits disponibles. | Non vérifié |
| `id` | Un identifiant de challenge est présent sous le nom `challenge`, mais il ne s'agit pas du même nom de champ. | Similarité fonctionnelle seulement |
| `algorithm` | Le JWT possède un en-tête `alg` ; ce n'est pas une correspondance littérale avec `algorithm`. | Hypothèse |
| `issuedAt` | Le JWT contient `iat`, qui représente une date d'émission ; le nom diffère. | Similarité sémantique seulement |

**Limite importante :** je n'ai pas encore vérifié une par une la présence littérale de ces six chaînes dans le corps brut de la réponse HTTP 403 de Burp Suite. Les correspondances ci-dessus ne doivent donc pas être présentées comme six champs confirmés de cette réponse. De même, un nom présent dans une réponse ou un jeton ne prouve pas qu'il est accepté comme paramètre de requête par le serveur.

## 4. Analyse

Le résultat d'Arjun est compatible avec une extraction de champs utilisés par une couche de vérification anti-automatisation. Lors de mes observations précédentes sur cet endpoint, j'avais également relevé des réponses HTTP 403 et 429 et des indices de challenge Anubis.

Je ne peux cependant pas déterminer avec certitude l'origine de chacun des six noms sans revoir la réponse HTTP brute concernée. Les sorties disponibles ne démontrent ni un nouveau paramètre caché ni une faille de sécurité.

## 5. Conclusion

J'ai exécuté Arjun 2.2.7 sur `/LogOn/Authenticate`. L'outil a proposé six noms candidats : `policyRuleHash`, `method`, `randomData`, `id`, `algorithm` et `issuedAt`. **Aucun paramètre caché n'a été découvert par Arjun.**

La comparaison avec mes observations précédentes montre deux correspondances littérales dans les données du JWT de challenge (`policyRuleHash`, `method`) et plusieurs similitudes non confirmées. **Aucune vulnérabilité exploitable n'a été démontrée.**

**Étape documentaire restante :** examiner hors ligne la réponse HTTP 403 déjà enregistrée dans Burp Suite, rechercher les six noms dans son corps et noter les correspondances exactes avant de conclure sur leur provenance.

**Preuve conservée :** sortie du terminal Arjun fournie lors de l'investigation. Aucun cookie, mot de passe ni jeton de session n'est reproduit dans cette fiche.
