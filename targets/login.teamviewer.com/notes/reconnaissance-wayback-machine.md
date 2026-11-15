# Étape 6 — Recherche d'URL et paramètres historiques avec Wayback Machine

**Date de l'analyse :** 15 novembre 2026  
**Cible étudiée :** écosystème web TeamViewer, avec distinction entre les sous-domaines `login.teamviewer.com`, `account.teamviewer.com` et `www.teamviewer.com`  
**Technique :** reconnaissance passive à partir de l'API CDX de l'Internet Archive  
**Résultat :** trois noms de paramètres GET historiques identifiés dans l'échantillon de `www.teamviewer.com` ; aucun paramètre de connexion confirmé

## 1. Objectif

J'ai recherché d'anciennes URL de TeamViewer afin d'identifier des chemins et paramètres GET qui auraient pu apparaître dans les versions antérieures de son site. J'ai utilisé l'API publique Wayback Machine, sans soumettre de tests d'exploitation aux serveurs TeamViewer.

## 2. Méthode

J'ai interrogé l'API CDX avec la recherche `<domaine>/*`, le format `output=json`, les colonnes `timestamp,original,statuscode`, le filtre `statuscode:200` et `collapse=urlkey`. Une première extraction était limitée à 100 résultats par sous-domaine, puis j'ai élargi l'échantillon de `www.teamviewer.com` à **500 URL**.

Exemple de commande de récupération de l'échantillon principal :

```bash
curl -sS -G "https://web.archive.org/cdx/search/cdx" \
  --data-urlencode "url=www.teamviewer.com/*" \
  --data-urlencode "output=json" \
  --data-urlencode "fl=timestamp,original,statuscode" \
  --data-urlencode "filter=statuscode:200" \
  --data-urlencode "collapse=urlkey" \
  --data-urlencode "limit=500" \
  -o wayback_teamviewer_www.json
```

J'ai ensuite utilisé Python (`urllib.parse.urlsplit` et `parse_qsl`) pour extraire les chemins, les noms des paramètres GET et leur fréquence, puis relever leurs domaines, chemins et dates de capture. Je n'ai pas conservé les valeurs des paramètres dans cette fiche.

## 3. Résultats par sous-domaine

| Domaine | Résultat API | Commentaire |
| --- | ---: | --- |
| `login.teamviewer.com` | 0 URL retournée | Réponse HTTP 200 avec tableau JSON vide `[]` |
| `account.teamviewer.com` | 0 URL retournée | Réponse HTTP 200 avec tableau JSON vide `[]` |
| `www.teamviewer.com` | 500 URL retournées | Résultat plafonné par le paramètre `limit=500` |

**Précision :** un résultat vide indique qu'aucune URL n'a été renvoyée *avec ces paramètres de recherche* ; il ne démontre pas l'absence absolue de captures archivées. Les 500 résultats représentent un **échantillon plafonné**, et non le total des archives du domaine.

Sur les 500 URL retournées pour `www.teamviewer.com`, j'ai recensé **298 chemins distincts** et **3 noms de paramètres GET distincts**.

## 4. Paramètres GET trouvés

| Paramètre | Occurrences dans l'échantillon | Date(s) et chemin(s) observés | Interprétation |
| --- | ---: | --- | --- |
| `dpl` | 257 | 3–4 novembre 2026, principalement `/_next/static/chunks/*.js` | Paramètre d'URL associé à des ressources JavaScript statiques ; fonction exacte non établie |
| `aspxerrorpath` | 2 | 17 et 23 juillet 2013, `/404.aspx` | Nom compatible avec un mécanisme historique de page d'erreur ASP.NET |
| `pid` | 1 | 30 avril 2010, `/` | Paramètre historique dont le rôle est inconnu |

### Exemples de preuves extraites

```text
PARAMÈTRE : dpl
Occurrences : 257
Date : 20261104092243
Domaine : www.teamviewer.com
Chemin : /_next/static/chunks/0-rbp631lk9rz.js

PARAMÈTRE : aspxerrorpath
Occurrences : 2
Date : 20130723134836
Domaine : www.teamviewer.com
Chemin : /404.aspx

PARAMÈTRE : pid
Occurrences : 1
Date : 20100430081815
Domaine : www.teamviewer.com:80
Chemin : /
```

D'autres chemins présents dans les résultats comprennent `/.well-known/security.txt`, `/10/0107/08/company/index.aspx` et `/10/0107/08/products/security.aspx`.

Certaines URL retournées ont des chemins inattendus pour TeamViewer. Je ne les considère pas comme des fonctionnalités actives ou pertinentes sans vérification supplémentaire de leur contexte archivistique.

## 5. Analyse et limites

Le paramètre `dpl` apparaît massivement dans des URL de fichiers sous `/_next/static/chunks/`. Son nombre élevé d'occurrences ne signifie pas qu'il expose une fonctionnalité sensible. `aspxerrorpath` est associé à de vieilles pages d'erreur en `.aspx`, tandis que `pid` apparaît une seule fois sur une archive de la page principale.

Ces données proviennent de **`www.teamviewer.com`**, et non de **`login.teamviewer.com/LogOn/Authenticate`**. Elles ne permettent donc pas d'affirmer que ces paramètres sont acceptés par l'endpoint de connexion actuel. Une URL historiquement archivée ne prouve ni son accessibilité présente ni une vulnérabilité.

Je n'ai effectué aucune exploitation de ces chemins ou paramètres dans cette phase.

## 6. Conclusion

J'ai réalisé une recherche passive avec Wayback Machine sur trois domaines TeamViewer. Mes recherches pour `login.teamviewer.com` et `account.teamviewer.com` n'ont pas retourné d'URL dans les conditions utilisées. Sur un échantillon de 500 URL de `www.teamviewer.com`, j'ai identifié 298 chemins distincts et trois paramètres GET : `dpl`, `aspxerrorpath` et `pid`.

**Je n'ai identifié aucun paramètre historique directement relié au point d'authentification `/LogOn/Authenticate`, ni aucune vulnérabilité exploitable.** Ce travail constitue une cartographie historique et non une preuve de faille.

**Preuve :** sorties de l'API CDX et résultats d'extraction Python reproduits ci-dessus. Les dates sont celles des captures d'archives, pas nécessairement les dates de création des pages.
