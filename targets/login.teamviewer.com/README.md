# Enquête de sécurité sur la console TeamViewer

L’enquête porte sur `login.teamviewer.com`. Elle suit le parcours d’un utilisateur, de la connexion à la gestion du profil, des sessions et des groupes. Les vérifications après connexion s’appuient sur des comptes de test.

**Résultat général.** Aucune vulnérabilité n’a été confirmée dans les essais documentés. Le dossier décrit les comportements observés et les limites de chaque vérification.

## 1. Repérage et connexion

L’analyse de la page de connexion a relevé jQuery 3.7.1 dans un fichier JavaScript. La recherche dans les archives a retrouvé trois noms de paramètres historiques sur le site vitrine. Aucun paramètre de connexion n’a été confirmé par cette recherche.

| Vérification | Résultat | Détail |
| --- | --- | --- |
| Paramètres cachés | Arjun a relevé six noms candidats et n’a confirmé aucun paramètre caché. | [Fiche Arjun](notes/authentification/recherche-parametres-arjun.md) |
| Injection SQL | Les essais sqlmap sur le champ `UserName` n’ont confirmé aucune injection. Les refus HTTP 403 et la limitation signalée par les HTTP 429 réduisent la portée du résultat. | [Fiche sqlmap](notes/authentification/analyse-sqlmap-rate-limiting-429.md) |
| XSS et WAF | Aucun essai XSS applicatif n’est documenté. La présence d’un WAF a été signalée par une heuristique de sqlmap et reste à confirmer. | [Couverture des vérifications](notes/reperage/technologies-login.md#couverture-des-vérifications) |

[Fiche cible](fiche-cible.md) · [Technologies observées](notes/reperage/technologies-login.md)

## 2. Récupération du compte et sessions

- **Récupération du compte.** Le courriel de récupération a été reçu et l’interface a confirmé la réinitialisation du mot de passe. [Journal de bord](notes/suivi/journal.md#réinitialisation-et-réouverture-du-lien)
- **Révocation d’une session.** Safari est revenu à la page de connexion après révocation de sa session. La session Chrome utilisée pour la comparaison est restée connectée. [Fiche sur les sessions](notes/compte-et-sessions/gestion-sessions.md)
- **Points encore ouverts.** La notification distincte après changement du mot de passe et le comportement de l’authentification à plusieurs facteurs restent à vérifier.

## 3. Sauvegarde du profil

La vérification a comparé la réponse HTTP et le nom réellement affiché dans le profil.

| Cas observé | Réponse HTTP | État du profil |
| --- | --- | --- |
| Jeton absent ou invalide | HTTP 403 | Nom inchangé |
| Sauvegarde avec le compte de test | HTTP 200 accompagné d’un message d’erreur | Nouveau nom affiché dans le profil |

La seconde ligne montre un décalage entre le message renvoyé et le résultat visible de la sauvegarde. [Comparaison et captures](evidences/comparaison-profil.md) · [Relevé de la sauvegarde](notes/profil/observation-http-profil.md)

## 4. Autorisation des groupes

Les captures présentent les groupes de deux comptes de test, A et B. Les consultations normales ont renvoyé les données du groupe ou des listes de partage vides. Les autres essais documentés ont donné un HTTP 403 ou un HTTP 200 accompagné d’une erreur applicative (`s: 0`). Les réponses d’erreur ne montrent aucune donnée du groupe visé. Aucun accès intercompte non autorisé de type IDOR/BOLA n’a été confirmé.

[Fiche sur les groupes et liens vers les preuves](notes/groupes/autorisation-groupes.md) · [Captures expurgées](evidences/groupes/)

## 5. Pièces du dossier

- [Notes classées par thème](notes/README.md)
- [Index des captures](evidences/README.md)
- [Checklist de connexion](checklist-login.md)
- [Journal de bord](notes/suivi/journal.md)
