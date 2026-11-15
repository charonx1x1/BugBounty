# Investigation — données transmises via Referer

Le HAR Safari a été analysé localement à partir du document HTTP 200 de /LogOn. Sur les 42 requêtes HTTPS du segment, 21 vont vers des hôtes externes à TeamViewer. Le relevé classe l’en-tête Referer par niveau de détail. Les valeurs brutes sont exclues.

| Destination | Requêtes | Referer absent | Origine seule | Dont origine login.teamviewer.com |
| --- | ---: | ---: | ---: | ---: |
| fonts.gstatic.com | 2 | 1 | 1 | 0 |
| www.gstatic.com | 11 | 1 | 10 | 1 |
| www.recaptcha.net | 8 | 0 | 8 | 5 |
| Total | 21 | 2 | 19 | 6 |

Aucun Referer externe observé ne contient de chemin, de paramètres ou de fragment. Six exposent uniquement l’origine de la console. Ce résultat est compatible avec Referrer-Policy: strict-origin-when-cross-origin, relevé sur la réponse du formulaire. Les origines tierces peuvent aussi provenir de documents intégrés. La politique du document principal ne permet pas à elle seule d’attribuer chaque valeur.

**Portée.** Le verdict couvre le chargement avant saisie, pas la soumission, la récupération ni les corps de requête. Aucune fuite de chemin ou de paramètre par Referer n’a été observée sur ce segment.

[Relevé des en-têtes et du trafic](pistes-login.md)
