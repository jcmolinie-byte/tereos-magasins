# 🏭 Tereos Magasins - Plateforme de Partage de Pièces

Application web pour faciliter le partage de pièces détachées entre les différents sites Tereos, avec suivi de l'impact CO₂ et stockage persistant des données.

## 📋 Fonctionnalités

- ✅ **Stockage persistant** : Toutes les pièces sont sauvegardées dans un fichier sur le serveur
- 🔍 **Recherche avancée** : Rechercher par nom, site ou référence SAP
- 📊 **Suivi CO₂** : Calcul automatique de l'impact environnemental
- 🔄 **Réservations** : Système de réservation avec notification par email
- 🌓 **Mode sombre/clair** : Interface adaptable
- 📱 **Responsive** : Fonctionne sur tous les appareils

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### 1. Installation des dépendances

#### Backend (serveur)
```bash
cd server
npm install
```

#### Frontend (interface)
```bash
# À la racine du projet
npm install
```

### 2. Démarrage de l'application

**Important** : Vous devez démarrer le serveur backend AVANT le frontend.

#### Terminal 1 - Démarrer le backend
```bash
cd server
npm start
```

Le serveur démarre sur `http://localhost:3001` et affiche :
```
╔═══════════════════════════════════════════════╗
║   🚀 SERVEUR TEREOS MAGASINS                 ║
║   Port: 3001                                  ║
║   Stockage: /chemin/vers/data                 ║
║   Status: ✅ Opérationnel                    ║
╚═══════════════════════════════════════════════╝
```

#### Terminal 2 - Démarrer le frontend
```bash
npm run dev
```

L'interface web s'ouvre automatiquement sur `http://localhost:5173`

## 📁 Structure du Projet

```
tereos-magasins/
├── server/                  # Backend Node.js/Express
│   ├── index.js            # Serveur API
│   ├── package.json        # Dépendances backend
│   └── data/               # 📦 STOCKAGE PERSISTANT (créé automatiquement)
│       └── stock.json      # Fichier contenant toutes les pièces
│
├── src/
│   ├── App.tsx             # Application principale
│   ├── services/
│   │   └── storage.ts      # Service de communication avec l'API
│   ├── components/         # Composants React
│   └── ...
│
├── package.json            # Dépendances frontend
├── .env                    # Configuration API URL
└── README.md              # Ce fichier
```

## 🗄️ Stockage des Données

### Dossier `server/data/`

**C'est ici que toutes vos pièces sont sauvegardées !**

- Créé automatiquement au premier démarrage du serveur
- Fichier `stock.json` contient toutes les annonces de pièces
- **Persistant** : Les données ne sont PAS perdues quand vous :
  - Fermez le navigateur
  - Videz le cache internet
  - Redémarrez le serveur
  - Redémarrez l'ordinateur

### Structure du fichier stock.json
```json
{
  "stock": [
    {
      "id": 1707834567890,
      "piece": "Pompe hydraulique",
      "refSAP": "SAP-123456",
      "categorie": "Hydraulique",
      "site": "Artenay",
      "co2": 120,
      "disponible": true,
      "ownerEmail": "user@tereos.com",
      "createdAt": "2024-02-12T10:30:00.000Z"
    }
  ],
  "users": []
}
```

## 🔧 API Endpoints

Le serveur backend expose les endpoints suivants :

### Stock
- `GET /api/stock` - Récupérer toutes les pièces
- `POST /api/stock` - Ajouter une nouvelle pièce
- `PUT /api/stock/:id` - Modifier une pièce
- `DELETE /api/stock/:id` - Supprimer une pièce
- `PATCH /api/stock/:id/toggle-availability` - Changer la disponibilité

### Statistiques
- `GET /api/stats` - Obtenir les statistiques globales

### Santé
- `GET /api/health` - Vérifier l'état du serveur

## 🔒 Sécurité des Données

### Sauvegarde recommandée

Pour éviter toute perte de données, il est recommandé de sauvegarder régulièrement le dossier `server/data/`.

**Méthodes de sauvegarde** :

1. **Copie manuelle** :
   ```bash
   cp -r server/data server/data_backup_$(date +%Y%m%d)
   ```

2. **Git** (ajouter au .gitignore si souhaité) :
   ```bash
   # Ne pas ignorer le dossier data si vous voulez le versionner
   git add server/data/stock.json
   git commit -m "Sauvegarde du stock"
   ```

3. **Automatisation** : Créer un script de sauvegarde automatique

## 🌍 Déploiement en Production

### Option 1 : Serveur local (réseau interne Tereos)

1. Installer Node.js sur le serveur
2. Cloner le projet
3. Configurer l'URL de l'API dans `.env` :
   ```
   VITE_API_URL=http://ip-du-serveur:3001/api
   ```
4. Démarrer le backend et le frontend

### Option 2 : Hébergement cloud

Backend : Héberger sur Railway, Render, ou Heroku
Frontend : Héberger sur Vercel, Netlify, ou GitHub Pages

## 🐛 Dépannage

### Le frontend ne peut pas se connecter au backend

1. Vérifiez que le serveur backend est démarré
2. Vérifiez l'URL dans le fichier `.env`
3. Vérifiez le port dans `server/index.js` (par défaut 3001)

### Les données ne sont pas sauvegardées

1. Vérifiez que le dossier `server/data/` existe
2. Vérifiez les permissions d'écriture sur le dossier
3. Consultez les logs du serveur backend

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :
- Vérifiez que le backend utilise le middleware `cors()`
- Vérifiez l'URL de l'API dans le frontend

## 📝 Développement

### Mode développement avec rechargement automatique

Backend :
```bash
cd server
npm install -g nodemon
npm run dev
```

Frontend :
```bash
npm run dev
```

## 📊 Impact Environnemental

L'application calcule automatiquement l'impact CO₂ économisé grâce au partage de pièces :

- Hydraulique : ~120 kg CO₂
- Pneumatique : ~80 kg CO₂
- Mécanique : ~150 kg CO₂
- Électrique : ~200 kg CO₂
- Électronique : ~90 kg CO₂

## 📞 Support

Pour toute question ou problème, contactez l'équipe IT Tereos.

## 📄 Licence

Propriété de Tereos - Usage interne uniquement
