# Archives — Faculté de Droit, UFHB

Prototype de bibliothèque numérique pour déposer et consulter les mémoires,
exposés et dissertations de la filière Droit.

## Ce que fait ce prototype

- Recherche et consultation des travaux publiés (`/`)
- Dépôt d'un travail avec fichier PDF (`/deposer`)
- Fiche d'un travail avec lecteur PDF intégré et compteurs (`/document/[id]`)
- Interface de modération pour valider ou refuser les dépôts (`/moderation`)
- Charte de dépôt (`/charte`), acceptation obligatoire avant l'envoi d'un travail
- Retrait d'un travail par son propre auteur, à tout moment
- Page de profil listant les dépôts de l'étudiant connecté et leur statut (`/profil`)
- Page "À propos" présentant le fonctionnement et le portage du projet (`/a-propos`)
- Connexion par email universitaire (`/connexion`)
- Installable sur mobile et PC (PWA, icônes incluses)

## Mise en route

### 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un compte gratuit.
2. Crée un nouveau projet.
3. Dans l'onglet "SQL Editor", colle le contenu de `supabase/schema.sql` et
   exécute-le. Cela crée la table des travaux, les règles de sécurité, et
   l'espace de stockage des PDF.
4. Dans "Project Settings" puis "API", récupère l'URL du projet et la clé
   `anon public`.

### 2. Configurer le projet

Copie `.env.example` vers `.env.local` et colle les deux valeurs récupérées
à l'étape précédente :

```
NEXT_PUBLIC_SUPABASE_URL=ton-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-cle-anon
```

### 3. Lancer le projet en local

```
npm install
npm run dev
```

Le site est alors accessible sur `http://localhost:3000`.

### 4. Mettre en ligne (Vercel)

1. Dépose ce projet sur un dépôt GitHub.
2. Va sur [vercel.com](https://vercel.com), connecte ton compte GitHub, et
   importe le dépôt.
3. Renseigne les deux mêmes variables d'environnement dans les paramètres
   du projet Vercel.
4. Vercel déploie automatiquement le site, et le redéploie à chaque
   modification poussée sur GitHub.

## Modération des dépôts

Par défaut, un travail déposé reste au statut `en_attente` et n'est pas
visible publiquement. La page `/moderation` permet à un modérateur de
consulter le PDF puis de valider ou refuser chaque dépôt.

Pour donner les droits de modération à quelqu'un :

1. La personne doit s'être connectée au moins une fois sur le site (via
   `/connexion`), pour qu'un compte existe.
2. Dans Supabase, va dans "Authentication" puis "Users", et copie
   l'identifiant (UUID) de cette personne.
3. Va dans "Table Editor", ouvre la table `moderateurs`, et ajoute une ligne
   avec cet identifiant dans la colonne `user_id`.

La personne a alors accès à `/moderation` dès sa prochaine connexion.

## Charte de dépôt et droit d'auteur

Chaque dépôt exige l'acceptation d'une charte (`/charte`) avant l'envoi. Ce
choix s'appuie sur la loi ivoirienne n° 2016-555 relative au droit d'auteur :
un mémoire est une œuvre protégée dès sa rédaction, et sa mise en ligne
requiert l'accord explicite de son auteur, distinct de la soutenance
académique elle-même.

Trois conséquences techniques de ce cadre :

- Un dépôt sans consentement coché est refusé par la base de données
  elle-même (contrainte au niveau de Supabase), pas seulement par
  l'interface.
- L'auteur d'un travail garde, à tout moment, le droit de le retirer depuis
  sa propre fiche document, sans validation d'un modérateur nécessaire :
  c'est un droit moral perpétuel, pas une faveur du site.
- Un travail retiré disparaît immédiatement du catalogue public, mais reste
  visible par son auteur.

## Prochaines étapes possibles

- Renseigner une vraie adresse de contact dans `/a-propos` (actuellement un texte à compléter)
- Filtres supplémentaires (par type de travail, par encadrant)
- Statistiques globales (nombre de travaux, matières les plus consultées)
- Application native (React Native / Electron) si l'usage web ne suffit plus
