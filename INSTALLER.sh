#!/bin/bash

echo "========================================"
echo "   INSTALLATION TEREOS MAGASINS"
echo "========================================"
echo ""
echo "Ce script va installer toutes les dépendances nécessaires."
echo "Cela peut prendre 2-3 minutes..."
echo ""
read -p "Appuyez sur Entrée pour continuer..."

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}[1/3]${NC} Installation des dépendances du BACKEND..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}ERREUR lors de l'installation du backend !${NC}"
    echo "Vérifiez que Node.js est bien installé : https://nodejs.org"
    exit 1
fi

echo ""
echo -e "${BLUE}[2/3]${NC} Installation des dépendances du FRONTEND..."
cd ..
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}ERREUR lors de l'installation du frontend !${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}[3/3]${NC} Création du dossier de données..."
mkdir -p server/data
echo '{"stock":[],"users":[]}' > server/data/stock.json
chmod +x start.sh

echo ""
echo "========================================"
echo -e "${GREEN}✓ INSTALLATION TERMINÉE !${NC}"
echo "========================================"
echo ""
echo "Prochaine étape :"
echo "  1. Exécutez : ./start.sh"
echo "  2. Attendez 10 secondes"
echo "  3. Le navigateur s'ouvrira automatiquement"
echo ""
echo "Vos données seront sauvegardées dans : server/data/stock.json"
echo ""
