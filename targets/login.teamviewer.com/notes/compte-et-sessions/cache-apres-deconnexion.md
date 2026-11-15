# Investigation — cache HTTP et profil après déconnexion

**Question.** Quelles réponses demandent au navigateur de ne rien stocker, et quelles preuves restent nécessaires pour évaluer l’affichage d’un profil après déconnexion ?

| Réponse étudiée | Cache-Control | Portée |
| --- | --- | --- |
| Document de connexion `/LogOn` dans Safari, HTTP 200 | `no-cache, no-store` | Formulaire public |
| Accès direct à `/LogOn`, HTTP 403 | `no-store` | Réponse de refus uniquement |
| Sauvegarde du profil, HTTP 200 | `no-cache, no-store, must-revalidate, private` | Réponse à la sauvegarde, distincte du document de profil |
| Document du profil après déconnexion | Non relevé | Point à documenter |

Les trois réponses relevées incluent une consigne de non-stockage HTTP. Les preuves disponibles ne montrent pas ce qui reste visible dans l’historique du navigateur après déconnexion. Le relevé de la sauvegarde ne permet pas d’attribuer les mêmes en-têtes à l’affichage du profil.

**Vérification restante.** Sur le compte de test, utiliser la déconnexion normale. Observer séparément le bouton Retour et un rechargement du profil. Si le navigateur réaffiche une page avant de renvoyer vers la connexion au rechargement, relever ces deux états séparément. La réapparition d’un écran et l’accès à une page protégée au rechargement sont deux observations différentes. Masquer les données du compte dans toute capture.

**Verdict actuel.** Consigne de non-stockage observée sur les réponses listées. Comportement du profil dans l’historique après déconnexion indéterminé. Aucun nouvel essai exécuté pour cette fiche.

[Capture de la connexion](../reperage/pistes-login.md) · [Relevé HTTP du profil](../profil/observation-http-profil.md)
