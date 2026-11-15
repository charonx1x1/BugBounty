# Relevé expurgé — comparaison du jeton du profil

Transcription des réponses relevées pendant le contrôle manuel. Ce document ne constitue pas un export brut des échanges. Les cookies, les jetons valides, l’adresse du compte et les identifiants de trace sont omis.

## Référence

Requête : `POST /UserManagement/UpdateProfile` vers `login.teamviewer.com`, avec le jeton d’origine et le nom demandé « Projet test A ».

```http
HTTP/2 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{"s":1,"m":"Une erreur non spécifiée est survenue."}
```

État affiché ensuite : « Projet test A ». Le nom a été rétabli à « Projet test » avant le contrôle suivant.

## Valeur invalide

Modification étudiée : `__xflud3rser4sd: test-invalide`. Le corps devait toujours demander « Projet test A » ; aucune modification volontaire des cookies.

```http
HTTP/2 403 Forbidden
Content-Type: text/html; charset=utf-8
```

```json
{"s":0,"ec":"mWNLmj9mkJp-3-3-66-Lkb","m":"An unexpected error occurred: mWNLmj9mkJp-3-3-66-Lkb"}
```

État affiché ensuite : « Projet test ». Le Content-Type déclaré est HTML, même si le corps communiqué présente une structure JSON.

## Conclusion et limites

Défense observée dans ce scénario ; aucune faille CSRF démontrée. La comparaison ne teste pas une requête issue d’un site tiers. Voir [le protocole et ses limites](../notes/profil/essai-jeton-invalide.md). Les captures contenant des secrets ne sont pas publiées.


## Complément : en-tête absent

Sans l’en-tête : HTTP 403 et nom « Projet test » inchangé. Après rétablissement d’un jeton valide dans le même contexte de cookies : HTTP 200 et nom « Projet test A ». Les deux résultats sont documentés par les réponses et captures communiquées. La dernière capture ne confirme pas encore le nettoyage final. Les valeurs des cookies et du jeton valide sont omises.
