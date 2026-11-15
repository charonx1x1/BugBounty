# Investigation — cookies émis avant connexion

Analyse des en-têtes Set-Cookie présents dans le HAR Safari du chargement de /LogOn avant saisie. Le comptage couvre les émissions enregistrées. Plusieurs émissions peuvent concerner le même cookie. Les noms et valeurs sont exclus du relevé.

| Hôte émetteur | Émissions | Secure | HttpOnly | SameSite explicite | Domain explicite |
| --- | ---: | ---: | ---: | --- | ---: |
| login.teamviewer.com | 2 | 2 | 1 | Aucun | 0 |
| www.teamviewer.com | 1 | 1 | 1 | None | 1 |
| www.recaptcha.net | 3 | 3 | 3 | None | 0 |

Les six émissions portent Secure et cinq portent HttpOnly. Les quatre émissions déclarant SameSite=None portent aussi Secure. Le rôle du cookie sans HttpOnly reste inconnu. L’absence de SameSite explicite ne permet pas de déduire la politique effective appliquée par Safari.

**Limites.** Un en-tête Set-Cookie témoigne d’une émission. Il ne prouve ni l’acceptation par le navigateur ni l’envoi lors d’une requête ultérieure. Le relevé couvre la page avant connexion. Les cookies authentifiés sont traités dans un [relevé distinct](../suivi/cookies-et-bilan.md). Aucun défaut exploitable établi par cette analyse.
