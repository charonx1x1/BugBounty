# TEST-SESSION-01 — Révocation et isolation des sessions

**Cible :** login.teamviewer.com
**Catégorie :** Gestion des sessions
**Verdict :** Conforme pour le scénario testé

## Objectif

Vérifier qu'une session révoquée ne permet plus d'accéder à une page protégée, sans interrompre une autre session légitime.

## Environnement

- Chrome : session principale
- Safari : session secondaire
- Compte de test TeamViewer

## Procédure et observations

1. Connexion au compte depuis Chrome et Safari.
2. Accès confirmé aux pages protégées dans les deux navigateurs.
3. Six connexions actives affichées.
4. Suppression de la connexion Safari depuis Chrome.
5. Passage de six à cinq connexions.
6. Actualisation de Safari : redirection vers la page de connexion.
7. Actualisation de Chrome : session principale toujours authentifiée.

## Résultat

Après la révocation, Safari a été redirigé vers la page de connexion à l’actualisation de la page protégée. Chrome est resté authentifié. La révocation a donc produit l’effet attendu sur les deux sessions observées.

Le scénario vérifie l’accès à la page protégée utilisée pendant l’essai. Le comportement des autres routes et jetons reste indéterminé.

## Preuves

- SESSION-01 : liste des connexions avant révocation.
- SESSION-02 : liste après révocation, si capture conservée.
- SESSION-03 : page de connexion dans Safari.
- SESSION-04 : Chrome toujours connecté, si capture conservée.
