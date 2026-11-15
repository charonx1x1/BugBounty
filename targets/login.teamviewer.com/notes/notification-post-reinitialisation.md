# Investigation — notification après réinitialisation du mot de passe

## Question

Le titulaire est-il averti après un changement de mot de passe effectué via le parcours de récupération ? Une notification distincte peut aider à détecter une modification inattendue.

## Analyse des preuves existantes

| Étape | Preuve disponible | Verdict |
| --- | --- | --- |
| Demande de récupération | Courriel contenant le lien de réinitialisation reçu sur le compte de test | Observé |
| Changement du mot de passe | Confirmation de réussite affichée par TeamViewer | Observé |
| Alerte après le changement | Aucun message distinct n’est documenté dans les pièces examinées | Indéterminé |
| Effet sur les sessions déjà ouvertes | La note de révocation décrit une fermeture manuelle de session | Indéterminé pour la réinitialisation |

Le courriel qui permet de réinitialiser le mot de passe précède la modification. Il ne constitue donc pas une preuve d’alerte après changement. De même, la fermeture manuelle d’une session renseigne sur une autre action que la réinitialisation.

## Vérification documentaire restante

Dans la boîte du compte de test, rechercher un message distinct autour de l’heure de la confirmation, y compris dans les indésirables si disponibles. Pour le rapport, relever uniquement l’objet expurgé, le moment par rapport à la confirmation et la présence éventuelle d’instructions pour signaler une modification inattendue. Si la boîte temporaire ou l’historique n’est plus accessible, conserver « indéterminé ». Aucun nouvel essai de connexion ou de récupération n’a été réalisé pour cette fiche.

## Références et portée

- [OWASP — Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html). Référence pour distinguer le flux de réinitialisation, la notification et le traitement des sessions.
- [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html), sections 4.2 et 4.6. Référence de conception pour les notifications d’événements de compte. L’applicabilité de ce référentiel à TeamViewer n’est pas établie.
- [Journal du projet](journal.md) et [révocation des sessions](gestion-sessions.md).

**Bilan.** Réinitialisation confirmée. Notification postérieure et effet sur les sessions indéterminés. Aucune vulnérabilité établie par cette revue.
