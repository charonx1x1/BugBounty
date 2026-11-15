# Essai ciblé — jeton du profil invalide

**Bilan actuel : défense observée dans Burp (voir la dernière section).** Les tentatives Safari ci-dessous restent non concluantes et sont conservées comme historique.

## Objectif

Déterminer si le serveur rejette une sauvegarde normale du profil du compte A lorsque l’en-tête `__xFlUD3rsEr4sd` contient une valeur invalide. Ce contrôle depuis la même origine ne constitue pas une preuve d’exploitation CSRF depuis un site tiers.

## Actions réalisées

1. Capturer une nouvelle sauvegarde normale de `/UserManagement/UpdateProfile` avec le nom « Projet test ».
2. Créer dans Safari une substitution locale de cette requête, à URL exacte.
3. Remplacer la valeur de l’en-tête `__xFlUD3rsEr4sd` par `test-invalide` dans la configuration de substitution. Les cookies n’ont pas été volontairement modifiés.
4. Déclencher une seule sauvegarde du profil, sans changement du nom. Le corps de référence conservait les données du compte A.
5. Observer une navigation vers la racine du site, puis la console du compte A.
6. Supprimer la substitution locale et constater sa disparition du panneau Sources.
7. Ouvrir de nouveau le profil : nom affiché « Projet test ».

## Résultat : non concluant

La requête de l’essai n’était plus disponible dans le panneau Réseau après la navigation. Ni l’en-tête réellement envoyé, ni le statut HTTP, ni le corps de réponse de cet essai n’ont pu être vérifiés. La configuration d’une substitution ne prouve pas à elle seule qu’elle a été appliquée à la requête envoyée.

L’absence de changement du nom ne prouve pas un refus puisque le corps demandait déjà ce même nom. La navigation ne prouve ni une acceptation ni un rejet. Aucune vulnérabilité et aucune validation effective du jeton ne sont démontrées par cet essai.

## Reprise avec conservation du réseau

Après reconnexion, une sauvegarde normale a été capturée et retrouvée avec le filtre `UpdateProfile`. Une substitution locale a ensuite été configurée avec `test-invalide` et l’option « Inclure les données de la requête d’origine » cochée. Le formulaire portait le nom temporaire « Projet test controle ». Une seule sauvegarde de contrôle a été déclenchée.

L’interface a affiché « Erreur ». La nouvelle ligne réseau a été conservée, mais son statut était « — » et son aperçu indiquait « Une erreur s’est produite lors de la tentative de chargement de la ressource. ». L’en-tête affiché contenait toujours une valeur de jeton d’origine, et non `test-invalide`. Aucun envoi effectif du jeton invalide ni refus HTTP du serveur n’est donc démontré. La cause de l’échec de chargement n’a pas été isolée.

La substitution a été supprimée, puis son absence vérifiée dans Sources. Après rechargement du profil, le nom enregistré était « Projet test ». La tentative n’a pas établi de modification persistante du nom. Preuve locale de l’état final : `outputs/profil-apres-controle.png`.

Conclusion inchangée : contrôle serveur du jeton indéterminé. Ne pas présenter cette erreur de chargement comme un rejet CSRF. Une prochaine exécution nécessite un moyen de modification de requête dont l’effet réel est vérifiable ; répéter le même montage Safari sans résoudre cette limite n’apporterait pas de preuve.


## Comparaison manuelle dans Burp Repeater

Cette étape repose sur les captures et réponses relevées pendant une manipulation guidée. Aucun export intégral expurgé des deux requêtes n’a été conservé pour comparaison indépendante.

La référence provient de la requête 1112 : `POST /UserManagement/UpdateProfile`. Le corps demandait le nom « Projet test A ». Le rejeu avec le jeton d’origine a renvoyé HTTP 200 et `{"s":1,"m":"Une erreur non spécifiée est survenue."}`. La capture suivante affichait « Projet test A ». Le message JSON seul ne permet donc pas de conclure à un échec ; la signification exacte de `s` reste inconnue.

Le nom initial « Projet test » a ensuite été rétabli par le formulaire et vérifié à l’écran. Dans Repeater, une capture montre la valeur `test-invalide` dans l’en-tête `__xflud3rser4sd`. La consigne était de conserver les cookies et le corps demandant « Projet test A ».

| Cas | Réponse communiquée | Nom affiché après la consigne de rechargement |
| --- | --- | --- |
| Jeton d’origine | HTTP 200, s:1, message générique d’erreur | Projet test A |
| Jeton invalide | HTTP 403 Forbidden, s:0, message « An unexpected error occurred » | Projet test |

**Conclusion :** les observations indiquent un contrôle serveur du jeton sur cette requête : rejet de la valeur invalide et absence de modification visible du nom. Aucune vulnérabilité CWE-352 n’est démontrée. Le nom initial est rétabli.

**Limites :** le rejeu direct conserve le contexte authentifié ; aucune exploitation depuis une origine tierce n’a été testée. À cette étape, le jeton absent restait à tester ; voir le complément ci-dessous. La liaison à une autre session et les autres actions restent non évaluées. La capture finale atteste le nom affiché, sans prouver à elle seule le geste de rechargement. Le composant responsable du rejet n’a pas été identifié. Ne pas généraliser ce résultat à tout le site.

Les captures brutes contenant des cookies ou jetons ne doivent pas être publiées. Aucun secret ni adresse du compte n’est reproduit ici.


## Complément — en-tête absent et contrôle positif

La requête du profil a été préparée sans l’en-tête `__xflud3rser4sd`, en conservant le cookie du même nom et un corps demandant « Projet test A ». Une ligne vide accidentelle entre les en-têtes a été corrigée avant l’essai. La réponse fournie montre HTTP 403 Forbidden, `s:0` et un message générique d’erreur. La capture du compte affiche « Projet test ».

Un contrôle positif a ensuite été exécuté dans le même onglet Repeater en rétablissant un jeton valide. Les textes des requêtes fournis présentent les mêmes cookies et le même nom demandé. La capture montre une longueur recalculée à 283, une réponse HTTP 200 avec `s:1`, puis le navigateur affiche « Projet test A ». Ce contrôle réussi écarte une session expirée comme explication suffisante du refus précédent, dans les conditions observées.

| En-tête | Réponse | Effet visible |
| --- | --- | --- |
| Invalide (première série) | HTTP 403 | Nom inchangé |
| Absent (seconde série) | HTTP 403 | Nom inchangé |
| Valide, rétabli après suppression | HTTP 200 | Nom changé en Projet test A |

**Bilan :** exigence de présence et contrôle de validité de l’en-tête observés dans ces essais sur la sauvegarde du profil. Aucune faille CSRF démontrée. Ces rejeux ne démontrent pas la sécurité de toutes les actions ni le comportement d’une requête issue d’un site tiers.

**État de clôture :** la dernière capture affiche « Projet test A ». Le rétablissement du nom initial et la déconnexion ont été demandés, mais leur réalisation après ce dernier contrôle n’est pas encore attestée. Ne pas présenter le nettoyage comme vérifié.

Les requêtes complètes reçues contiennent des secrets et ne sont pas conservées dans cette fiche ni destinées à GitHub.
