# 🌐 GUIDE D'HÉBERGEMENT EN PRODUCTION

## Vue d'ensemble

Votre application Tereos Magasins peut être hébergée de plusieurs façons selon vos besoins :
- **Hébergement interne** (serveur Tereos)
- **Cloud public** (accessible via internet)
- **Solution hybride** (backend interne + frontend cloud)

---

## 📊 COMPARAISON DES SOLUTIONS

| Solution | Coût | Complexité | Sécurité | Maintenance | Recommandé pour |
|----------|------|------------|----------|-------------|-----------------|
| **Serveur interne Tereos** | Gratuit | Faible | ⭐⭐⭐⭐⭐ | Vous | Usage interne uniquement |
| **Cloud (Render/Railway)** | €5-15/mois | Faible | ⭐⭐⭐⭐ | Automatique | Accès internet + interne |
| **VPS (DigitalOcean)** | €5-10/mois | Moyenne | ⭐⭐⭐⭐ | Vous | Contrôle total |
| **Azure/AWS** | Variable | Élevée | ⭐⭐⭐⭐⭐ | Complexe | Grandes entreprises |

---

## 🏢 OPTION 1 : HÉBERGEMENT SUR SERVEUR INTERNE TEREOS
**⭐ Recommandé pour la sécurité des données internes**

### Prérequis
- Un serveur Windows/Linux avec accès réseau interne
- Node.js installé (v16+)
- Accès administrateur

### Installation

#### Sur Windows Server
```batch
# 1. Installer Node.js
Télécharger depuis https://nodejs.org (version LTS)

# 2. Copier le projet sur le serveur
# Par exemple dans C:\inetpub\tereos-magasins

# 3. Installer les dépendances
cd C:\inetpub\tereos-magasins
cd server
npm install --production

cd ..
npm install
npm run build

# 4. Créer un service Windows
npm install -g pm2
pm2 start server/index.js --name tereos-backend
pm2 startup
pm2 save

# 5. Servir le frontend avec IIS ou nginx
# Le dossier dist/ contient l'application compilée
```

#### Sur Linux Server (Ubuntu/Debian)
```bash
# 1. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Cloner/copier le projet
cd /var/www/
sudo mkdir tereos-magasins
cd tereos-magasins

# 3. Installer les dépendances
cd server
npm install --production

cd ..
npm install
npm run build

# 4. Configurer PM2 (gestionnaire de processus)
sudo npm install -g pm2
pm2 start server/index.js --name tereos-backend
pm2 startup systemd
pm2 save

# 5. Configurer Nginx comme reverse proxy
sudo nano /etc/nginx/sites-available/tereos
```

### Configuration Nginx (exemple)
```nginx
server {
    listen 80;
    server_name tereos-magasins.local;  # ou l'IP du serveur

    # Frontend
    location / {
        root /var/www/tereos-magasins/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Avantages ✅
- Données restent sur le réseau Tereos (sécurité maximale)
- Pas de coûts d'hébergement
- Contrôle total
- Respect des politiques de sécurité IT

### Inconvénients ❌
- Nécessite un serveur et configuration IT
- Accessible uniquement depuis le réseau Tereos
- Maintenance manuelle

---

## ☁️ OPTION 2 : HÉBERGEMENT CLOUD (FACILE)
**⭐ Recommandé pour démarrage rapide et accès externe**

### A. Render.com (GRATUIT pour démarrer)

#### Étapes détaillées :

**1. Backend sur Render**
```bash
# 1. Créer un compte sur https://render.com

# 2. Créer un nouveau "Web Service"
# - Connecter votre dépôt Git ou uploader le dossier server/
# - Build Command: npm install
# - Start Command: npm start
# - Environment: Node

# 3. Variables d'environnement
PORT=10000  # Render définit automatiquement
```

**2. Frontend sur Render ou Vercel**
```bash
# Sur Render - Créer un "Static Site"
# Build Command: npm run build
# Publish Directory: dist

# Variables d'environnement :
VITE_API_URL=https://votre-backend.onrender.com/api
```

#### Coût
- **Gratuit** : 750h/mois (suffisant pour 1 instance)
- **Payant** : $7/mois pour performance garantie

### B. Railway.app (Très facile)

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Déployer le backend
cd server
railway init
railway up

# 4. Déployer le frontend
cd ..
railway init
railway up

# Railway génère automatiquement les URLs
```

#### Coût
- **Gratuit** : $5 de crédit offert
- **Payant** : ~$5/mois usage réel

### C. Vercel (Frontend) + Render (Backend)
**⭐ Combinaison populaire et performante**

```bash
# Frontend sur Vercel (GRATUIT)
npm i -g vercel
vercel login
vercel --prod

# Backend sur Render (voir ci-dessus)
```

---

## 🖥️ OPTION 3 : VPS (SERVEUR VIRTUEL)
**Pour contrôle total à petit prix**

### Fournisseurs recommandés
- **DigitalOcean** : €6/mois (1GB RAM)
- **Hetzner** : €4/mois (2GB RAM) 
- **OVH** : €3.50/mois (2GB RAM)

### Installation complète

```bash
# 1. Créer un droplet Ubuntu 22.04

# 2. Se connecter en SSH
ssh root@votre-ip

# 3. Mise à jour système
apt update && apt upgrade -y

# 4. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 5. Installer Nginx
apt install -y nginx

# 6. Installer PM2
npm install -g pm2

# 7. Créer un utilisateur
adduser tereos
usermod -aG sudo tereos

# 8. Cloner le projet
su - tereos
git clone [votre-repo] tereos-magasins
cd tereos-magasins

# 9. Installer et démarrer
cd server
npm install --production
pm2 start index.js --name tereos-api
pm2 startup
pm2 save

cd ..
npm install
npm run build

# 10. Configurer Nginx (voir config ci-dessus)

# 11. Installer SSL gratuit
apt install certbot python3-certbot-nginx
certbot --nginx -d votredomaine.com
```

---

## 🔒 OPTION 4 : AZURE/AWS (POUR TEREOS SI DÉJÀ CLIENT)

### Azure App Service

```bash
# Si Tereos utilise déjà Azure

# 1. Créer deux App Services
# - tereos-magasins-api (Node.js)
# - tereos-magasins-web (Static Web App)

# 2. Déployer via Azure CLI
az login
az webapp up --name tereos-magasins-api
az staticwebapp create --name tereos-magasins-web
```

### AWS (EC2 + S3 + RDS)
- **EC2** : Pour le backend Node.js
- **S3** : Pour le frontend (fichiers statiques)
- **RDS** : Base de données (si besoin futur)

---

## 🗄️ MIGRATION DE DONNÉES

### Passer du fichier JSON à une vraie base de données

À terme, il sera recommandé de migrer vers une base de données :

#### PostgreSQL (Recommandé)
```javascript
// Dans server/index.js - remplacer le système de fichiers

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET stock
app.get('/api/stock', async (req, res) => {
  const result = await pool.query('SELECT * FROM stock ORDER BY id DESC');
  res.json({ success: true, stock: result.rows });
});

// POST stock
app.post('/api/stock', async (req, res) => {
  const { piece, refSAP, categorie, site, co2, ownerEmail } = req.body;
  const result = await pool.query(
    'INSERT INTO stock (piece, refSAP, categorie, site, co2, disponible, ownerEmail) VALUES ($1, $2, $3, $4, $5, true, $6) RETURNING *',
    [piece, refSAP, categorie, site, co2, ownerEmail]
  );
  res.json({ success: true, item: result.rows[0] });
});
```

#### MongoDB (Alternative)
```javascript
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  piece: String,
  refSAP: String,
  categorie: String,
  site: String,
  co2: Number,
  disponible: Boolean,
  ownerEmail: String
}, { timestamps: true });

const Stock = mongoose.model('Stock', StockSchema);
```

---

## 📋 CHECKLIST AVANT MISE EN PRODUCTION

### Sécurité
- [ ] Ajouter authentification réelle (JWT tokens)
- [ ] Configurer HTTPS/SSL
- [ ] Ajouter rate limiting (protection contre spam)
- [ ] Valider toutes les entrées utilisateur
- [ ] Configurer CORS correctement
- [ ] Changer les secrets/clés par défaut

### Performance
- [ ] Activer la compression gzip
- [ ] Mettre en cache les ressources statiques
- [ ] Optimiser les images
- [ ] Minifier JS/CSS

### Monitoring
- [ ] Configurer les logs (PM2, Winston)
- [ ] Alertes en cas d'erreur
- [ ] Monitoring serveur (uptime)
- [ ] Sauvegardes automatiques des données

### Code de production
```javascript
// server/index.js - Ajouts pour production

// 1. Variables d'environnement
require('dotenv').config();

// 2. Logging
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// 3. Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes
});
app.use('/api/', limiter);

// 4. Helmet pour sécurité
const helmet = require('helmet');
app.use(helmet());

// 5. Compression
const compression = require('compression');
app.use(compression());
```

---

## 💰 ESTIMATION DES COÛTS

### Hébergement Cloud (recommandé pour démarrer)
- **Render Free Tier** : 0€ (limité)
- **Render Starter** : 7€/mois
- **Railway** : ~5€/mois
- **Total** : **7-12€/mois** tout compris

### VPS
- **Hetzner CX11** : 4€/mois (2GB RAM, 20GB SSD)
- **Domaine** : 10€/an
- **Total** : **~5€/mois**

### Serveur interne Tereos
- **Coût** : 0€ (utilise infra existante)
- **Setup initial** : 1-2 jours IT

---

## 🎯 MA RECOMMANDATION

### Pour DÉMARRER (phase test/MVP)
➡️ **Render.com** (gratuit ou 7€/mois)
- Déploiement en 10 minutes
- SSL automatique
- Pas de gestion serveur
- Parfait pour tester avec les utilisateurs

### Pour PRODUCTION (usage réel)
➡️ **Serveur interne Tereos** + **Migration PostgreSQL**
- Données sensibles restent en interne
- Conforme aux politiques IT
- Coût = 0€ hébergement
- Investissement : configuration initiale uniquement

### Plan de migration suggéré
1. **Phase 1** (maintenant) : Test sur Render.com - 0€
2. **Phase 2** (après validation) : Migration serveur interne Tereos
3. **Phase 3** (croissance) : Ajout base de données PostgreSQL
4. **Phase 4** (optionnel) : Accès mobile via Azure si besoin

---

## 🆘 SUPPORT HÉBERGEMENT

Pour choisir la meilleure solution pour Tereos :
- Contacter l'équipe IT pour connaître l'infrastructure existante
- Vérifier si Tereos a déjà Azure/AWS
- Évaluer le nombre d'utilisateurs prévus
- Définir si accès externe est nécessaire

**Besoin d'aide pour l'hébergement ?** 
Je peux vous fournir les scripts de déploiement spécifiques une fois que vous aurez choisi votre solution !
