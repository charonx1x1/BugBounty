# Trois enquêtes sur des services d’identité — application à TeamViewer

Cas retenus pour la méthode d’investigation. Aucun de ces incidents ne concerne login.teamviewer.com.

| Source | Obstacle | Décision des enquêteurs | Application aux preuves TeamViewer |
| --- | --- | --- | --- |
| [Okta — enquête sur le portail de support](https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/) | Deux chemins vers un même fichier produisaient des événements de journal différents. | Okta a élargi la corrélation à l’autre type d’événement et a réévalué la portée. | Indexer les captures par hôte, chemin, méthode et statut. La CSP du formulaire s’attribue au document HTTP 200, séparément du refus HTTP 403 et de la réponse de sauvegarde du profil. |
| [BeyondTrust — détection dans une console Okta](https://www.beyondtrust.com/blog/entry/okta-support-unit-breach) | Les traces détenues par l’équipe cliente donnaient une vue partielle. | BeyondTrust a rapproché ses événements internes et demandé à Okta les journaux d’accès au support. | Pour la révocation Safari, chercher quatre preuves distinctes : accès avant, entrée retirée, retour à la connexion et Chrome toujours connecté. La chronologie reste rapportée là où les captures manquent. Les journaux du fournisseur seraient nécessaires pour établir la décision côté serveur. |
| [Microsoft — enquête Storm-0558 et rectificatif](https://www.microsoft.com/en-us/msrc/blog/2023/09/results-of-major-technical-investigations-for-storm-0558-key-acquisition/) | Des journaux nécessaires pour confirmer le chemin d’acquisition de la clé n’étaient plus disponibles. | Microsoft a distingué le mécanisme jugé probable des preuves disponibles. La publication contient aussi un rectificatif sur la condition de concurrence. | Distinguer le fait « accès direct à /LogOn → HTTP 403 » des causes possibles. Aucun élément disponible n’isole le composant responsable. Pour la récupération, la réapparition du formulaire ne confirme pas l’usage unique du lien. |

## Application au rapport

| Observation | Preuve | Conclusion admissible | Limite |
| --- | --- | --- | --- |
| /LogOn affiche le formulaire dans Safari | Document 200 et en-têtes dans le HAR | Configuration HTTP du document observé | Cause du 403 direct indéterminée |
| Le nom change avec le jeton valide, malgré le message générique | Requête de référence et capture du nom | Effet métier visible | Cause du message inconnue |
| Le nom reste inchangé quand le jeton est absent ou invalide | HTTP 403 et état affiché, avec contrôle positif pour la série sans en-tête | Rejet et absence d’effet visible dans les cas observés | Aucun scénario issu d’une origine tierce |
| La session Safari perd l’accès après retrait, Chrome reste connecté | Note de révocation et preuves à rapprocher | Révocation ciblée rapportée | Délai et confiance future indéterminés |

Pour chaque ligne, joindre une preuve expurgée et signaler si elle est directe, rapportée ou manquante. Le HAR brut reste local. Aucune nouvelle requête de test n’a été envoyée pour cette comparaison.
