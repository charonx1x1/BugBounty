# Technologies et CVE du formulaire TeamViewer

Analyse locale du HAR Safari de la réponse HTTP 200 de /LogOn et des ressources publiques capturées. Aucune nouvelle requête de test envoyée à la console pour cette analyse.

| Point | Résultat | Limite |
| --- | --- | --- |
| Bibliothèque front-end | La bannière du bundle logon.libs.js indique jQuery 3.7.1. | Les avis CVE-2020-11022 et CVE-2020-11023 concernent des versions antérieures à 3.5.0 selon jQuery. Ces deux avis ne s’appliquent pas à la version observée. |
| Serveur et base de données | Aucun en-tête Server, X-Powered-By ou de version ASP.NET dans la réponse 200 capturée. | Framework, version serveur et moteur SQL indéterminés. |
| HTML initial | Sept références de scripts extraites. Aucun attribut action de formulaire ni name de champ relevé par l’extraction. | L’interface rendue affiche les champs e-mail et mot de passe. L’HTML initial seul ne décrit pas le contrat de soumission. |
| Scripts | Bundles de connexion, configuration JavaScript, traduction française et ressources de consentement visibles. | Les noms de fichiers ne suffisent pas à identifier leurs dépendances ou à établir une fuite de secrets. |
| Bulletins TeamViewer | Les bulletins consultés couvrent notamment des clients et modules Remote Management. | Aucun des avis examinés n’a pu être rattaché au formulaire avec les preuves disponibles. |
| Wayback Machine | La recherche dans les archives a relevé trois noms de paramètres GET historiques sur le site vitrine. | Aucun paramètre de connexion confirmé. Fiche Wayback Machine |

## Couverture des vérifications

- **SQLi (CWE-89)** — Les essais avec sqlmap sur le champ `UserName` du formulaire d’authentification n’ont confirmé aucune injection. Les réponses HTTP 403 et 429 limitent la portée du résultat. [Fiche sqlmap](../authentification/analyse-sqlmap-rate-limiting-429.md)
- **XSS (CWE-79)** — Aucun essai XSS applicatif n’est documenté. Les deux avis jQuery cités portent sur la bibliothèque et sa version.
- **Recherche de paramètres** — Arjun a relevé six noms candidats et n’a confirmé aucun paramètre caché. Cette recherche automatisée est le seul essai de ce type documenté ici. [Fiche Arjun](../authentification/recherche-parametres-arjun.md)
- **WAF et limitation des requêtes** — sqlmap a signalé des HTTP 403 et 429, ainsi qu’un indice heuristique de WAF/IPS. La cause des refus 403 et la présence d’un WAF restent à confirmer. [Fiche sqlmap](../authentification/analyse-sqlmap-rate-limiting-429.md)
- **Revue défensive côté produit** : vérifier que les requêtes de base de données sont paramétrées et que les valeurs d’authentification ne sont ni réfléchies sans encodage contextuel ni consignées dans les journaux.

Sources : [bulletins TeamViewer](https://www.teamviewer.com/fr/resources/trust-center/security-bulletins/), [avis jQuery CVE-2020-11022](https://github.com/jquery/jquery/security/advisories/GHSA-gxr4-xjj5-5px2), [avis jQuery CVE-2020-11023](https://github.com/jquery/jquery/security/advisories/GHSA-jpcq-cgw6-v4j6).
