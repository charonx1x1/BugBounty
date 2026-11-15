# Démo locale pour la soutenance

Depuis ce dossier, lancer `python3 -m http.server 8000 --bind 127.0.0.1`, puis ouvrir http://127.0.0.1:8000. Saisir « Équipe & recherche <M2> » et cliquer sur **Afficher**. Le résultat contient les caractères littéraux. Le formulaire n’envoie aucune donnée.

| Étape | Code à montrer |
| --- | --- |
| Source | `nameField.value` |
| Passage | `showName(output, nameField.value)` |
| Rendu | `output.textContent = name` |

Le navigateur crée du texte par la propriété `textContent`. La valeur ne passe donc pas dans l’analyseur HTML. Le flux a été vérifié avec Node et un DOM simulé.

## CodeQL et Syft

Les deux outils étaient absents de la machine lors de la préparation. Depuis ce dossier, une fois les outils installés :

```sh
codeql database create ../demo-codeql-db --language=javascript-typescript --build-mode=none --source-root=.
codeql database analyze ../demo-codeql-db javascript-security-and-quality.qls --format=sarif-latest --output=../demo-codeql.sarif
syft dir:. -o cyclonedx-json=../demo-sbom.json
```

Le rapport CodeQL contiendra les alertes des règles exécutées. Le tableau ci-dessus sert à montrer le flux sûr qui peut rester absent du rapport d’alertes. L’inventaire Syft porte sur ce dossier. Ce mini-projet a un manifeste et zéro dépendance tierce.

## Script oral — environ une minute

« Je saisis un nom avec des chevrons. La valeur part du champ, traverse la fonction showName et arrive dans textContent. Le navigateur l’affiche telle quelle. Cette propriété se vérifie parce que j’ai accès au code de mon exemple. CodeQL sert à analyser les flux et à signaler certains chemins à risque. Syft répond à une autre question : quels composants l’inventaire recense-t-il ? Ici, le manifeste ne déclare aucune dépendance. Pour TeamViewer, j’ai observé le trafic et identifié jQuery dans un fichier public. Le code serveur reste hors de portée de ces preuves. »
