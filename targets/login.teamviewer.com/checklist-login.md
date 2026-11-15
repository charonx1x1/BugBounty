# Checklist — Connexion TeamViewer

Cible étudiée : la page `/LogOn` de la console TeamViewer et les parcours accessibles au compte de test. Une case cochée signifie que l’observation est documentée. Une case vide signale un point à vérifier ou une preuve manquante.

## Formulaire et connexion

- [x] Relever le titre, l’URL et les champs du formulaire en français.
- [x] Repérer « Maintenir la connexion », « Mot de passe oublié ? », « S’inscrire » et l’entrée SSO.
- [x] Confirmer qu’une connexion normale ouvre la console du compte de test.
- [x] Noter la vérification anti-robot affichée durant la connexion.
- [ ] Documenter la durée et le comportement de « Maintenir la connexion ».
- [ ] Identifier dans la documentation produit les parcours SSO et MFA applicables au compte étudié.

## Inscription et récupération

- [x] Observer la demande d’activation par e-mail et l’accès après activation.
- [x] Relever le formulaire de récupération, le CAPTCHA, la réception du message et la confirmation de réinitialisation.
- [x] Documenter la réouverture du lien après utilisation. Le formulaire réapparaît et l’usage unique reste indéterminé.
- [ ] Relever la durée de validité annoncée du lien, si elle est documentée.
- [ ] Confirmer auprès de l’équipe produit les garanties d’expiration et d’usage unique côté serveur.

## Session après connexion

- [x] Relever les attributs Secure, HttpOnly et SameSite visibles dans Safari. Conserver « — » pour une valeur non affichée.
- [x] Observer l’écran des connexions actives.
- [x] Documenter le scénario de révocation rapporté dans GitHub : Safari revient à l’écran de connexion et Chrome reste connecté.
- [ ] Rapprocher ce scénario des captures disponibles. La note décrit le comportement de l’interface pour deux navigateurs.
- [ ] Confirmer la déconnexion finale du compte de test.

## Protection d’une action authentifiée

- [x] Relever une sauvegarde normale du profil et la prendre comme référence.
- [x] Observer HTTP 403 et aucun changement de nom avec un jeton invalide.
- [x] Observer HTTP 403 et aucun changement de nom sans l’en-tête du jeton.
- [x] Observer HTTP 200 et un changement de nom au contrôle positif avec le jeton valide rétabli.
- [x] Comparer la réponse au résultat visible. Le message JSON générique apparaît aussi lors d’une modification effective.
- [ ] Confirmer le retour au nom initial après le dernier contrôle positif.

Ce scénario porte sur la sauvegarde du profil. Le contrôle CSRF de la connexion et le comportement depuis une origine tierce restent hors de la couverture de cet essai.

## Preuves et rapport

- [x] Distinguer les observations directes, les résultats rapportés et les points indéterminés.
- [x] Préparer un relevé expurgé des réponses 200 et 403.
- [ ] Relier chaque résultat retenu à une preuve lisible, en masquant les identifiants et secrets de session.
- [ ] Vérifier les exclusions du programme avant de qualifier un constat.
- [ ] Expliquer l’impact observé et les limites pour chaque parcours cité dans le rapport.

**Bilan actuel :** le parcours de connexion normal est documenté. La protection du profil par le jeton a été observée dans les variantes étudiées. Aucune vulnérabilité de connexion ou CSRF n’a été démontrée.

[Journal](notes/journal.md) · [Cookies et bilan](notes/cookies-et-bilan.md) · [Comparaison du jeton](notes/essai-jeton-invalide.md) · [Preuve expurgée](evidences/comparaison-profil.md)

## Matrice de validation avancée

| ID | Propriété étudiée | Critère de validation | Verdict actuel |
| --- | --- | --- | --- |
| LG-01 | Accès authentifié | Le compte de test accède à la console après connexion et le profil affiché correspond au compte attendu | Observé pour le parcours normal |
| LG-02 | Activation de l’adresse | Les actions qui nécessitent une adresse vérifiée restent indisponibles avant activation | Activation demandée dans le flux normal. Portée du contrôle serveur indéterminée |
| LG-03 | Vérification anti-robot | Les décisions de vérification sont appliquées côté serveur selon la politique du produit | Vérification visible. Efficacité et couverture indéterminées |
| LG-04 | Expiration et usage unique du lien de récupération | Le secret expire selon la politique et une seule réinitialisation peut aboutir | Réinitialisation réussie, formulaire réaffiché après réouverture. Usage unique et durée indéterminés |
| LG-05 | Cookies de session | Les attributs observés correspondent à la politique du produit et à la sensibilité du cookie | Secure et HttpOnly relevés. SameSite varie selon le cookie. La valeur « — » reste indéterminée |
| LG-06 | Révocation ciblée | La session révoquée perd l’accès protégé. La seconde session conserve l’accès prévu | Rapporté pour Safari et Chrome. Captures à rapprocher du journal |
| LG-07 | Maintien de connexion | La durée, la fermeture du navigateur et la déconnexion suivent la politique attendue | Option visible. Comportement indéterminé |
| LG-08 | SSO et MFA | Les exigences documentées s’appliquent à chaque parcours concerné | Points d’entrée observés. Contrôles d’application indéterminés |
| LG-09 | Protection du profil après connexion | Les demandes rejetées laissent le profil inchangé et le contrôle positif modifie le nom attendu | Observé. HTTP 403 avec en-tête absent ou invalide et HTTP 200 avec jeton valide |
| LG-10 | Protection propre au formulaire de connexion | Les décisions de sécurité correspondent au contexte attendu pour le formulaire lui-même | Indéterminé. LG-09 porte sur le profil après connexion |

## Revue des preuves avant le rapport

- [x] **LG-09 — Contrôle positif.** Le jeton valide rétabli modifie le nom après le rejet observé sans en-tête. Les requêtes communiquées présentent les mêmes cookies, ce qui réduit l’hypothèse d’une session expirée.
- [x] **LG-09 — Résultat métier.** Le nom visible est le témoin retenu. Un HTTP 200 contient aussi un message générique d’erreur, dont la cause reste inconnue.
- [x] **LG-04 — Limite du témoin.** La réapparition du formulaire indique que l’interface reste accessible. Elle ne renseigne pas sur l’autorisation d’un second changement.
- [ ] **LG-06 — Chronologie de révocation.** Associer une preuve expurgée à l’état avant révocation, au retour à la connexion et au maintien de la seconde session. Relever le délai uniquement s’il a été mesuré.
- [ ] **LG-07 et LG-08 — Référentiel attendu.** Relever les garanties documentées par le fournisseur et les conditions qui les rendent applicables au compte de test.
- [ ] **Traçabilité.** Pour chaque ligne reprise dans le rapport, noter la preuve, le navigateur, l’état initial, l’état final, les autres explications plausibles et la portée du verdict.

## Réponse publique du formulaire et dépendances

- [x] Associer les en-têtes au document `/LogOn` affiché dans Safari (HTTP 200). HSTS, CSP, SAMEORIGIN, nosniff, Referrer-Policy et no-cache/no-store sont observés.
- [x] Distinguer le refus HTTP 403 obtenu par la requête directe. Sa cause reste indéterminée.
- [x] Confirmer l’origine de deux ressources : le script reCAPTCHA est servi par `www.gstatic.com` et la feuille OneTrust par `login.teamviewer.com`.
- [x] Vérifier la CSP complète : form-action, base-uri et frame-ancestors sont absentes de la réponse 200 relevée.
- [x] Relever les hôtes, méthodes, statuts et métadonnées des deux POST reCAPTCHA. La nature des valeurs transmises reste indéterminée.

[Relevés et limites](notes/pistes-login.md#réponse-normale-du-formulaire-dans-safari)
