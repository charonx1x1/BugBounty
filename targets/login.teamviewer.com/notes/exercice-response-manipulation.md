# EXERCICE-RESPONSE-01 — Manipulation d'une réponse HTTP fictive dans Burp Suite

**Contexte du projet :** audit pédagogique TeamViewer  
**Outil :** Burp Suite Community Edition 2026.10.1  
**Nature :** démonstration hors trafic réel, dans l'éditeur `Proxy > Match and replace > Add > Test`  
**Statut :** configuration observée ; résultat du bouton `Test` non confirmé sur la dernière capture

## Objectif

Comprendre la modification locale d'un corps de réponse HTTP dans Burp Suite, sans modifier une session réelle, contourner un CAPTCHA ni envoyer de nouvelles requêtes à TeamViewer.

## Configuration observée (capture utilisateur)

| Paramètre | Valeur |
| --- | --- |
| Mode | Settings mode |
| Type | Response body |
| Match | `refusée` |
| Replace | `modifiée` |
| Regex match | Désactivé |
| Comment | `hgf` |

### Réponse fictive d'origine

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"s":0,"m":"Connexion refusée"}
```

La capture montre encore le message original dans le panneau **Auto-modified response**. Elle ne suffit donc pas à confirmer le déclenchement de la règle avec le bouton `Test`.

### Résultat attendu après utilisation du bouton Test

```json
{"s":0,"m":"Connexion modifiée"}
```

Seul le message `m` doit changer. Le champ `s:0` continue d'indiquer un refus applicatif. La vérification effective de ce résultat reste à effectuer ou à documenter par une capture supplémentaire.

## Procédure de vérification locale

1. Ouvrir `Proxy > Match and replace > Add`.
2. Sélectionner `Response body`, saisir les champs ci-dessus et coller la réponse fictive.
3. Cliquer sur `Test` puis comparer les panneaux `Original response` et `Auto-modified response`.
4. Cliquer sur `Cancel` pour ne pas activer la règle sur le trafic réel.

## Interprétation et limites

- Le test intégré sert à prévisualiser un remplacement de contenu HTTP : il n'altère pas l'état d'un serveur.
- Modifier le texte d'un message ne crée pas de session authentifiée.
- La réponse est fictive et ne prouve aucune vulnérabilité sur `login.teamviewer.com`.
- Ce document n'inclut aucun cookie, mot de passe, jeton CAPTCHA ou SSO.

## Références officielles

- [Testing HTTP match and replace rules](https://portswigger.net/burp/documentation/desktop/tools/proxy/match-and-replace/testing)
- [Creating match and replace rules](https://portswigger.net/burp/documentation/desktop/tools/proxy/match-and-replace/creating)
