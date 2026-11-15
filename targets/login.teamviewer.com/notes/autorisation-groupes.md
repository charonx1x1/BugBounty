# Contrôles d’autorisation des groupes TeamViewer

L’investigation a porté sur les données et les partages des groupes dans la console TeamViewer. Les captures montrent deux comptes de test, A et B, et les réponses observées dans Burp Suite.

| Observation | Résultat | Captures |
| --- | --- | --- |
| Groupes des comptes de test | Le groupe de A et le « Groupe test B » apparaissent dans leurs interfaces respectives. | [Compte A](../evidences/groupes/capture-02.png), [compte B](../evidences/groupes/capture-06.png) |
| Lecture normale | La liste de groupes indique que le groupe de test appartient au compte connecté. La consultation des données du groupe renvoie HTTP 200 avec `s: 1`. Les listes de partages et de contacts à partager sont vides dans les réponses capturées. | [Liste des groupes](../evidences/groupes/capture-11.png), [données du groupe](../evidences/groupes/capture-05.png), [partages](../evidences/groupes/capture-03.png), [contacts à partager](../evidences/groupes/capture-04.png) |
| Essais dans Burp Repeater | Une réponse affiche HTTP 403 avec un corps vide. Deux autres affichent HTTP 200 avec `s: 0` et un message d’erreur générique. Aucune donnée du groupe visé n’apparaît dans ces réponses. | [HTTP 403](../evidences/groupes/capture-07.png), [erreur applicative](../evidences/groupes/capture-08.png), [autre erreur applicative](../evidences/groupes/capture-13.png) |
| Contact et partage | Le compte B affiche le compte A dans ses contacts. L’onglet Partages du groupe B présente une liste vide. | [Contact](../evidences/groupes/capture-09.png), [onglet Partages](../evidences/groupes/capture-10.png) |

**Bilan.** Aucun accès intercompte non autorisé ni aucune IDOR/BOLA n’a été confirmé dans les essais documentés. La cause précise du HTTP 403 et des erreurs applicatives reste indéterminée à partir des captures.

[Captures expurgées](../evidences/groupes/)
