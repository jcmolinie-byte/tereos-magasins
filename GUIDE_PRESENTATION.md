# 🖥️ PRÉSENTATION SUR VOTRE PC - GUIDE ULTRA-SIMPLE

## ⚡ SOLUTION LA PLUS RAPIDE (5 minutes)

### Installation unique (à faire une seule fois)

1. **Installer Node.js**
   - Aller sur https://nodejs.org
   - Télécharger la version LTS (recommandée)
   - Installer avec toutes les options par défaut
   - ✅ C'est tout !

2. **Décompresser le projet**
   - Extraire le fichier ZIP quelque part (ex: Bureau, Documents)
   - Ouvrir le dossier `tereos-magasins-v2`

3. **Installer les dépendances** (une seule fois)
   
   **Windows** :
   - Double-cliquer sur `INSTALLER.bat` (voir ci-dessous)
   
   **OU manuellement** :
   - Ouvrir le PowerShell/CMD dans le dossier
   - Taper :
   ```cmd
   cd server
   npm install
   cd ..
   npm install
   ```

---

## 🚀 DÉMARRAGE POUR CHAQUE PRÉSENTATION

### MÉTHODE 1 : Double-clic (SUPER FACILE)

**Windows** :
- Double-cliquer sur `start.bat` 
- Attendre 5 secondes
- Le navigateur s'ouvre automatiquement sur http://localhost:5173
- ✅ C'est tout !

**Mac/Linux** :
- Double-cliquer sur `start.sh` (ou `./start.sh` dans le terminal)
- Le navigateur s'ouvre automatiquement

### MÉTHODE 2 : Manuel (si les scripts ne marchent pas)

Ouvrir **2 fenêtres** de terminal/PowerShell :

**Terminal 1 - Backend** :
```cmd
cd chemin/vers/tereos-magasins-v2/server
npm start
```
Vous verrez :
```
╔═══════════════════════════════════════════════╗
║   🚀 SERVEUR TEREOS MAGASINS                 ║
║   Port: 3001                                  ║
║   Status: ✅ Opérationnel                    ║
╚═══════════════════════════════════════════════╝
```

**Terminal 2 - Frontend** :
```cmd
cd chemin/vers/tereos-magasins-v2
npm run dev
```
Vous verrez :
```
  ➜  Local:   http://localhost:5173/
```

---

## 🎯 PENDANT LA PRÉSENTATION

1. **Ouvrir** : http://localhost:5173 dans votre navigateur

2. **Se connecter** : N'importe quel email + mot de passe (ex: demo@tereos.com / demo)

3. **Démontrer les fonctionnalités** :
   - Ajouter une pièce
   - Chercher dans le stock
   - Réserver une pièce
   - Voir l'impact CO₂
   - Thème clair/sombre

4. **Les données sont sauvegardées** dans `server/data/stock.json`
   - Elles restent même si vous fermez tout
   - Elles restent même si vous éteignez le PC
   - Elles restent même après redémarrage

---

## ⚠️ IMPORTANT POUR LA DÉMO

### Pour avoir des données de démonstration

Le fichier `server/data/stock.json` sera créé automatiquement vide.

**Option 1** : Ajouter manuellement quelques pièces via l'interface avant la présentation

**Option 2** : Pré-remplir avec des données de test :

Modifier `server/data/stock.json` et ajouter :

```json
{
  "stock": [
    {
      "id": 1707834567890,
      "piece": "Pompe hydraulique Bosch",
      "refSAP": "SAP-123456",
      "categorie": "Hydraulique",
      "site": "Artenay",
      "co2": 120,
      "disponible": true,
      "ownerEmail": "artenay@tereos.com",
      "createdAt": "2024-02-12T10:30:00.000Z"
    },
    {
      "id": 1707834567891,
      "piece": "Vérin pneumatique SMC",
      "refSAP": "SAP-789012",
      "categorie": "Pneumatique",
      "site": "Connantre",
      "co2": 80,
      "disponible": true,
      "ownerEmail": "connantre@tereos.com",
      "createdAt": "2024-02-12T11:00:00.000Z"
    },
    {
      "id": 1707834567892,
      "piece": "Moteur électrique 15kW",
      "refSAP": "SAP-345678",
      "categorie": "Électrique",
      "site": "Origny",
      "co2": 200,
      "disponible": false,
      "ownerEmail": "origny@tereos.com",
      "createdAt": "2024-02-12T09:15:00.000Z"
    }
  ],
  "users": []
}
```

Redémarrer le serveur après modification.

---

## 🛑 ARRÊTER APRÈS LA PRÉSENTATION

**Méthode simple** :
- Fermer les 2 fenêtres de commande (backend + frontend)
- Fermer le navigateur

**Les données restent sauvegardées** dans `server/data/stock.json`

---

## 💡 ASTUCES POUR UNE BELLE DÉMO

### 1. Mode plein écran
Appuyer sur `F11` dans le navigateur pour masquer les barres

### 2. Zoom
- `Ctrl +` pour agrandir
- `Ctrl -` pour rétrécir
- `Ctrl 0` pour réinitialiser

### 3. Préparer plusieurs onglets
- Onglet 1 : Vue normale (utilisateur)
- Onglet 2 : Déposer une pièce (pour montrer l'ajout)
- Onglet 3 : Incognito (pour montrer plusieurs utilisateurs)

### 4. Thème
Basculer entre mode clair/sombre pour montrer l'adaptabilité

---

## ❓ DÉPANNAGE RAPIDE

### "npm n'est pas reconnu"
➜ Node.js n'est pas installé. Installer depuis https://nodejs.org

### Port 3001 ou 5173 déjà utilisé
```cmd
# Trouver quel programme utilise le port
netstat -ano | findstr :3001

# Tuer le processus (remplacer 1234 par le PID affiché)
taskkill /PID 1234 /F
```

### Le navigateur ne s'ouvre pas automatiquement
➜ Ouvrir manuellement : http://localhost:5173

### Les données ne se sauvegardent pas
➜ Vérifier que le dossier `server/data` existe et a les permissions d'écriture

### "Cannot find module"
```cmd
# Réinstaller les dépendances
cd server
rm -rf node_modules
npm install

cd ..
rm -rf node_modules
npm install
```

---

## 📊 CHECKLIST AVANT PRÉSENTATION

- [ ] Node.js installé
- [ ] Dépendances installées (`npm install` dans les 2 dossiers)
- [ ] Scripts testés une fois (start.bat ou start.sh)
- [ ] Quelques pièces ajoutées pour la démo
- [ ] Navigateur prêt (Chrome recommandé)
- [ ] Batterie chargée (si laptop)
- [ ] Pas de mise à jour Windows en cours 😅

---

## ⏱️ TIMING DE DÉMARRAGE

- Démarrage du backend : ~3 secondes
- Démarrage du frontend : ~5 secondes
- **Total** : ~10 secondes

💡 **Astuce** : Démarrer 2-3 minutes avant la présentation pour être sûr !

---

## 🎬 SCÉNARIO DE PRÉSENTATION SUGGÉRÉ

**1. Connexion** (30 sec)
"Voici l'écran de connexion. L'authentification sera intégrée avec l'AD Tereos."

**2. Vue d'ensemble** (1 min)
"On voit ici toutes les pièces disponibles dans les différents sites."

**3. Recherche** (30 sec)
"Je peux rechercher par nom, site, ou référence SAP..."

**4. Ajout d'une pièce** (1 min)
"Pour déposer une pièce, c'est très simple..."

**5. Réservation** (1 min)
"Quand je réserve, un email pré-rempli s'ouvre automatiquement..."

**6. Impact CO₂** (30 sec)
"Voici le CO₂ économisé grâce au partage..."

**7. Persistance** (30 sec)
"Toutes les données sont sauvegardées, même après fermeture..."

**Total** : 5 minutes de démo

---

## 🎁 BONUS : MODE PRÉSENTATION

Pour impressionner encore plus, vous pouvez :

1. **Connecter à un grand écran** (HDMI)
2. **Utiliser 2 écrans** : 
   - Écran 1 : Interface utilisateur
   - Écran 2 : Fichier `stock.json` en temps réel (avec VS Code)
3. **Montrer la sauvegarde en direct** : Ouvrir `stock.json` pendant que vous ajoutez une pièce

---

## 📞 SUPPORT RAPIDE

**Problème pendant la démo ?**
1. Fermer tout
2. Redémarrer les 2 terminaux
3. Attendre 10 secondes
4. Recharger le navigateur (F5)

**Ça ne marche toujours pas ?**
➜ Utiliser le fallback : montrer les captures d'écran préparées

---

**Temps de préparation total** : 10 minutes (installation initiale)  
**Temps de démarrage** : 10 secondes  
**Fiabilité** : ⭐⭐⭐⭐⭐

Vous êtes prêt ! 🚀
