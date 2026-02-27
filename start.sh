#!/bin/bash

echo "========================================"
echo "   DÉMARRAGE TEREOS MAGASINS"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installation des dépendances frontend...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERREUR: Node.js n'est pas installé !${NC}"
        echo "Téléchargez-le sur https://nodejs.org"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Démarrage de l'application...${NC}"
echo ""

# Pas besoin du backend pour la version localStorage
echo "Frontend uniquement (localStorage)..."
npm run dev

echo ""
echo "========================================"
echo -e "${GREEN}✓${NC} Application démarrée"
echo "  Frontend : http://localhost:5173"
echo "========================================"
