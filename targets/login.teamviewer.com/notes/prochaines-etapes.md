# Couverture de l’enquête

J’ai examiné le formulaire de connexion, l’interface après connexion et le parcours de récupération jusqu’à la confirmation du changement de mot de passe. Les observations figurent dans le [journal](journal.md) et la [cartographie après connexion](cartographie-authentifiee.md).

L’étude du jeton porte sur la sauvegarde du profil. La MFA et la portée du retrait de confiance du navigateur restent indéterminées.

## Contrôle CSRF réalisé

La comparaison du jeton d’origine et d’un jeton invalide dans Burp est documentée dans [la fiche du test](essai-jeton-invalide.md#comparaison-manuelle-dans-burp-repeater). Résultat : défense observée sur la sauvegarde du profil, aucune faille démontrée. Intégrer ce résultat et ses limites au rapport ; ne pas répéter ce même essai sans nouvel objectif.
