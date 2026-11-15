# Investigation — notification après réinitialisation du mot de passe

## Question

J’ai examiné les éléments du parcours de récupération pour savoir si le compte recevait un courriel distinct après le changement de mot de passe.

## Analyse des preuves existantes

| Étape | Preuve disponible | Verdict |
| --- | --- | --- |
| Demande de récupération | Courriel contenant le lien de réinitialisation reçu sur le compte de test | Observé |
| Changement du mot de passe | Confirmation de réussite affichée par TeamViewer | Observé |
| Alerte après le changement | Aucun message distinct n’est documenté dans les pièces examinées | Indéterminé |
| Effet sur les sessions déjà ouvertes | La note de révocation décrit une fermeture manuelle de session | Indéterminé pour la réinitialisation |

Le courriel qui permet de réinitialiser le mot de passe précède la modification. Il ne constitue donc pas une preuve d’alerte après changement. De même, la fermeture manuelle d’une session renseigne sur une autre action que la réinitialisation.

**Bilan.** Réinitialisation confirmée. Notification postérieure et effet sur les sessions indéterminés. Aucune vulnérabilité établie par cette revue.
