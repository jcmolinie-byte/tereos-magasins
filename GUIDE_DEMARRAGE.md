# 🚀 GUIDE RAPIDE DE DÉMARRAGE

## Pour les utilisateurs Windows

Double-cliquez simplement sur le fichier `start.bat` à la racine du projet.
Cela ouvrira deux fenêtres de commande :
- Une pour le serveur backend (port 3001)
- Une pour l'interface frontend (port 5173)

Votre navigateur ouvrira automatiquement l'application.

## Pour les utilisateurs Mac/Linux

1. Ouvrez un terminal dans le dossier du projet
2. Exécutez : `./start.sh`

OU en manuel :

**Terminal 1 - Backend**
```bash
cd server
npm install  # Seulement la première fois
npm start
```

**Terminal 2 - Frontend**
```bash
npm install  # Seulement la première fois
npm run dev
```

## 📍 Accès à l'application

Une fois les deux serveurs démarrés, ouvrez votre navigateur et allez sur :
**http://localhost:5173**

## 🔑 Connexion

Utilisez n'importe quelle adresse email et mot de passe pour vous connecter.
(C'est une version de démonstration, l'authentification réelle sera ajoutée plus tard)

## 💾 Où sont stockées mes données ?

Toutes vos pièces sont sauvegardées dans le fichier :
`server/data/stock.json`

**Important** : Ne supprimez pas le dossier `server/data/` si vous ne voulez pas perdre vos données !

## 🛑 Arrêter l'application

- **Windows** : Fermez les deux fenêtres de commande
- **Mac/Linux** : Appuyez sur Ctrl+C dans le terminal

## ❓ Problèmes ?

1. **Le frontend ne charge pas** : Vérifiez que le backend est bien démarré (port 3001)
2. **Port déjà utilisé** : Changez le port dans `server/index.js` (ligne 6)
3. **Erreur npm** : Exécutez `npm install` dans chaque dossier (racine et server/)

Pour plus d'informations, consultez le fichier `README_COMPLET.md`
