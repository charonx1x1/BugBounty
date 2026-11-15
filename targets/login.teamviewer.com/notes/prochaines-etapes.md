# Prochaines étapes — login.teamviewer.com

## Travail prévu

1. Relire le périmètre et les règles avant les vérifications.
2. Confirmer avec le groupe les deux ou trois CWE retenues et la répartition des domaines.
3. Ouvrir `/LogOn` et enregistrer une capture datée de la page dans un dossier `evidences/` associé à cette cible.
4. Le parcours d’inscription et le repérage après connexion sont réalisés : voir [la cartographie authentifiée](cartographie-authentifiee.md). Le parcours de récupération a ensuite été observé jusqu’à la confirmation du changement de mot de passe. Voir le journal et [le bilan des vérifications](cookies-et-bilan.md).


## Choix des CWE

Deux pistes sont envisagées pour le moment, CWE-287 (authentification incorrecte) et CWE-352 (CSRF). Le choix reste à discuter avec le groupe selon les fonctionnalités accessibles. Pour les CSRF, il faudra d’abord repérer une action sensible et comprendre les protections attendues.

Chaque vérification aura un objectif, des conditions de départ, un résultat attendu et une preuve. Les scénarios prévus resteront marqués « à tester » jusqu’à leur réalisation. Les conclusions tiendront compte des limites de chaque vérification.

## Contribution au rapport du groupe

| Section imposée | Éléments à préparer pour ma partie |
| --- | --- |
| Executive Summary | Résultats et limites, à rédiger une fois les essais terminés |
| Analyse du programme BBP | Périmètre, règles, récompenses, sources et analyse du cadre légal à compléter |
| Méthodologie | Choix et actions issus du journal |
| Résultats techniques | Scénarios exécutés et défenses observées pour les CWE choisies |
| Impact business | Conséquences étayées des constats, hypothèses explicitement signalées |
| Feuille de route de remédiation | Mesures reliées aux constats et à leur priorité |
| Retour d’expérience | Difficultés, coordination et enseignements tirés du projet |


## Contrôle CSRF réalisé

La comparaison du jeton d’origine et d’un jeton invalide dans Burp est documentée dans [la fiche du test](essai-jeton-invalide.md#comparaison-manuelle-dans-burp-repeater). Résultat : défense observée sur la sauvegarde du profil, aucune faille démontrée. Intégrer ce résultat et ses limites au rapport ; ne pas répéter ce même essai sans nouvel objectif.
