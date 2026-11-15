# Cartographie après connexion

Cette cartographie correspond au repérage initial. Les essais ultérieurs sont suivis dans [le journal](journal.md) et [le bilan](cookies-et-bilan.md).

## Conditions et méthode

Observation dans Safari avec un compte de test gratuit, désigné « compte A ». Navigation ordinaire dans les menus, sans modification des paramètres de sécurité, sans requêtes forgées et sans outil de scan. Les secrets, l’adresse de messagerie et les liens d’activation sont exclus de cette note.

## Parcours réalisé

L’inscription a conduit à un écran demandant l’activation du compte. Un message de vérification a été reçu et son lien a conduit à une confirmation d’activation. La connexion a ensuite ouvert `/nav/home`. Ce parcours montre une vérification de l’adresse dans le flux normal ; il ne démontre pas l’impossibilité de contourner l’activation.

## Écrans consultés

Toutes les routes ci-dessous appartiennent à `https://login.teamviewer.com`.

| Route | Observation | Limite de l’observation |
| --- | --- | --- |
| `/nav/home` | Console accessible ; compte marqué « Gratuit ». | Accès normal du compte A uniquement. |
| `/nav/profile/general` | Nom et adresse modifiables ; commandes de sauvegarde et de suppression du compte visibles. | Aucune modification ni suppression soumise. |
| `/nav/profile/security` | Changement de mot de passe, activation de la double authentification et récupération de compte à divulgation nulle de connaissance proposés. | Leur présence ne prouve pas leur efficacité. Aucun réglage modifié. |
| `/nav/profile/active-logins` | Une entrée visible « Session actuelle », Safari, FR. | Pas de vérification de révocation ou d’expiration. Le texte générique évoquant plusieurs connexions ne prouve pas leur existence. |
| `/nav/profile/trust-management` | Une entrée Safari avec le libellé « Mac OS X 10.15 » ; commande de révocation des permissions. | Le libellé ne constitue pas une identification fiable du système réel. Aucune révocation effectuée. |
| `/nav/users` | Invitation à demander un essai professionnel de 14 jours ou à rejoindre une société existante. | Restriction observée dans l’interface ; contrôle serveur non testé. Aucun essai ni rattachement demandé. |
| `/nav/servicequeue` | Recherche et filtres par groupe, statut et personne ; aucune donnée pour les filtres affichés. | Ne prouve pas l’absence de données pour tous les filtres ni l’isolation entre comptes. |
| `/nav/scripts` | Message indiquant que les scripts ne sont pas inclus dans le forfait. | Restriction d’interface uniquement ; aucun téléversement ni exécution. |

## Particularité de navigation

Un dialogue « Unsaved changes » est apparu en quittant les réglages de profil, sans modification volontaire pendant ce repérage. Le choix « Rejeter » a permis de rejoindre la gestion des utilisateurs sans sauvegarde. La cause n’est pas déterminée ; ce comportement n’est pas qualifié de vulnérabilité.

## Résultat et limites

Aucune vulnérabilité confirmée. Cette étape fournit un inventaire des fonctions accessibles et des restrictions affichées. Elle ne valide ni les protections CSRF, ni les contrôles d’accès côté serveur, ni la robustesse de l’authentification. Les observations reposent sur l’interface ; aucune trace HTTP ni capture destinée au dépôt n’a été enregistrée pour cette étape.
