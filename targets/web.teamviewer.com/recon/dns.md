
# Reconnaissance DNS - web.teamviewer.com

**Date :** 2026-11-11
**Cible :** web.teamviewer.com
**Outil :** dig (Kali Linux)

## 1. Objectif

Identifier les enregistrements DNS de notre cible
afin de mieux comprendre son adressage réseau.

## 2. Enregistrement A (IPv4)

Commande :
dig web.teamviewer.com A +noall +answer

Résultat :
web.teamviewer.com. 3286 IN A 144.208.243.52

## 3. Enregistrement AAAA (IPv6)

Commande :
dig web.teamviewer.com AAAA +noall +answer

Résultat :
web.teamviewer.com. 1069 IN AAAA 2605:380:52:5:144:208:243:52

## 4. Observations

- Le domaine possède un enregistrement IPv4.
- Le domaine possède un enregistrement IPv6.
- Les TTL affichés représentent les durées
  de validité restantes des réponses DNS.
- La présence d'adresses IP ne démontre pas
  l'existence d'une vulnérabilité.
