# Technologies et CVE du formulaire TeamViewer

Analyse locale du HAR Safari de la réponse HTTP 200 de /LogOn et des ressources publiques capturées. Aucune nouvelle requête de test envoyée à la console pour cette analyse.

| Point | Résultat | Limite |
| --- | --- | --- |
| Bibliothèque front-end | La bannière du bundle logon.libs.js indique jQuery 3.7.1. | Les avis CVE-2020-11022 et CVE-2020-11023 concernent des versions antérieures à 3.5.0 selon jQuery. Ces deux avis ne s’appliquent pas à la version observée. |
| Serveur et base de données | Aucun en-tête Server, X-Powered-By ou de version ASP.NET dans la réponse 200 capturée. | Framework, version serveur et moteur SQL indéterminés. |
| HTML initial | Sept références de scripts extraites. Aucun attribut action de formulaire ni name de champ relevé par l’extraction. | L’interface rendue affiche les champs e-mail et mot de passe. L’HTML initial seul ne décrit pas le contrat de soumission. |
| Scripts | Bundles de connexion, configuration JavaScript, traduction française et ressources de consentement visibles. | Les noms de fichiers ne suffisent pas à identifier leurs dépendances ou à établir une fuite de secrets. |
| Bulletins TeamViewer | Les bulletins consultés couvrent notamment des clients et modules Remote Management. | Aucun des avis examinés n’a pu être rattaché au formulaire avec les preuves disponibles. |
| Wayback Machine | La consultation de l’API publique des archives n’a pas abouti. | Historique des URL et paramètres indéterminé. |

## Couverture des vérifications

- **SQLi (CWE-89) et XSS (CWE-79)** : non testées. Une version jQuery hors de la plage de deux CVE ne tranche pas le risque XSS propre à l’application.
- **Paramètres cachés, fuzzing et WAF** : aucun essai actif. Le 403 observé lors d’un accès direct ne suffit pas à identifier sa cause.
- **Revue défensive côté produit** : vérifier que les requêtes de base de données sont paramétrées et que les valeurs d’authentification ne sont ni réfléchies sans encodage contextuel ni consignées dans les journaux.

Sources : [bulletins TeamViewer](https://www.teamviewer.com/fr/resources/trust-center/security-bulletins/), [avis jQuery CVE-2020-11022](https://github.com/jquery/jquery/security/advisories/GHSA-gxr4-xjj5-5px2), [avis jQuery CVE-2020-11023](https://github.com/jquery/jquery/security/advisories/GHSA-jpcq-cgw6-v4j6).
