# TeamViewer — Notes Bug Bounty

Ce répertoire regroupe le travail de reconnaissance et de vérification sur `login.teamviewer.com` réalisé dans un cadre pédagogique.

[Suivre les captures et les résultats dans l’ordre](evidences/README.md).

## Organisation du dossier local

- `fiche-cible.md` : cible et périmètre
- `notes/journal.md` : journal de tests
- `notes/cartographie-authentifiee.md` : cartographie après connexion
- `notes/cookies-et-bilan.md` : cookies et conclusions
- `notes/essai-jeton-invalide.md` : contrôle d'un jeton invalide
- `notes/observation-http-profil.md` : observation HTTP du profil
- `notes/prochaines-etapes.md` : suite des vérifications
- `evidences/comparaison-profil.md` : comparaison des réponses

**État :** aucun contournement confirmé dans ces observations. Les valeurs de cookies, jetons, mots de passe et informations du compte de test ne doivent pas être publiées.

> Les notes à jour sont directement dans `notes/` et `evidences/`. Le sous-dossier imbriqué `targets/login.teamviewer.com/` contient l’ancien import ; utiliser les chemins listés ci-dessus.
