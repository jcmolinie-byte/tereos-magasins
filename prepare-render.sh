#!/bin/bash

# Script de déploiement automatique pour Render.com
# Ce script prépare votre projet pour un déploiement sur Render

echo "=========================================="
echo "  PRÉPARATION DÉPLOIEMENT RENDER.COM"
echo "=========================================="
echo ""

# Créer le fichier render.yaml pour configuration automatique
cat > render.yaml << 'EOF'
services:
  # Backend API
  - type: web
    name: tereos-magasins-api
    env: node
    region: frankfurt  # Europe
    plan: free  # Ou 'starter' pour 7$/mois
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    
  # Frontend Static Site
  - type: web
    name: tereos-magasins-web
    env: static
    region: frankfurt
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        value: https://tereos-magasins-api.onrender.com/api

# Base de données (optionnel, pour plus tard)
databases:
  - name: tereos-db
    plan: free
    databaseName: tereos_magasins
    user: tereos_user
EOF

echo "✅ Fichier render.yaml créé"

# Créer un Dockerfile optimisé pour le backend
cat > server/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install --production

# Copier le code source
COPY . .

# Créer le dossier data
RUN mkdir -p data

EXPOSE 10000

CMD ["npm", "start"]
EOF

echo "✅ Dockerfile créé pour le backend"

# Créer .dockerignore
cat > server/.dockerignore << 'EOF'
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
data/*
!data/.gitkeep
EOF

echo "✅ .dockerignore créé"

# Créer un .gitkeep pour le dossier data
mkdir -p server/data
touch server/data/.gitkeep

# Mettre à jour le .gitignore
cat >> .gitignore << 'EOF'

# Render
render.yaml.backup
.render/
EOF

echo "✅ .gitignore mis à jour"

# Créer un script de build pour Render
cat > render-build.sh << 'EOF'
#!/bin/bash
echo "Building frontend..."
npm install
npm run build
echo "Build complete!"
EOF

chmod +x render-build.sh

echo "✅ Script de build créé"

echo ""
echo "=========================================="
echo "  📦 PROJET PRÊT POUR RENDER.COM"
echo "=========================================="
echo ""
echo "Prochaines étapes :"
echo ""
echo "1. Créer un compte sur https://render.com"
echo ""
echo "2. Créer un nouveau dépôt Git pour votre projet :"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git branch -M main"
echo "   git remote add origin [VOTRE-REPO-GIT]"
echo "   git push -u origin main"
echo ""
echo "3. Sur Render.com :"
echo "   - Cliquer 'New' → 'Blueprint'"
echo "   - Connecter votre dépôt Git"
echo "   - Render détectera automatiquement render.yaml"
echo "   - Cliquer 'Apply'"
echo ""
echo "4. Attendre le déploiement (5-10 minutes)"
echo ""
echo "5. Votre application sera accessible sur :"
echo "   https://tereos-magasins-web.onrender.com"
echo ""
echo "=========================================="
echo "Coût : GRATUIT (750h/mois)"
echo "=========================================="
