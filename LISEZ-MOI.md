# ⚡ DÉMARRAGE RAPIDE - 2 ÉTAPES

## 🎯 Pour présenter la maquette sur votre PC

### ÉTAPE 1️⃣ : Installer Node.js (une seule fois)
Télécharger et installer depuis : **https://nodejs.org** (version LTS)

### ÉTAPE 2️⃣ : Démarrer l'application

**Windows** : Double-cliquez sur `start.bat`

**Mac/Linux** : Dans le terminal, tapez `./start.sh`

➡️ Le navigateur s'ouvre automatiquement sur http://localhost:5173

**Note** : Pas besoin d'installer les dépendances manuellement, le script `start.bat` le fait automatiquement !

---

## 🎬 UTILISATION

1. **Connexion** : N'importe quel email + mot de passe (ex: demo@tereos.com / demo)
2. **Ajouter des pièces** : Onglet "Déposer une pièce"
3. **Chercher** : Barre de recherche en haut
4. **Réserver** : Cliquer sur une pièce disponible

---

## 💾 VOS DONNÉES

Toutes les pièces sont automatiquement sauvegardées dans **localStorage** de votre navigateur.

**Elles restent même si vous :**
- ✅ Fermez le navigateur
- ✅ Éteignez le PC
- ✅ Redémarrez l'application

**⚠️ ATTENTION** : Les données sont perdues si vous :
- ❌ Videz le cache du navigateur
- ❌ Utilisez le mode navigation privée
- ❌ Changez de navigateur (Chrome → Firefox)

**💡 Conseil** : Utilisez toujours le même navigateur pour vos présentations !

---

## 🎁 CHARGER DES DONNÉES DE DÉMONSTRATION

Pour avoir 10 pièces déjà créées et prêtes à montrer :

### MÉTHODE FACILE (Recommandée) :
1. **Double-cliquez** sur `CHARGER_DONNEES_DEMO.html`
2. Cliquez sur le bouton "Charger les données de démonstration"
3. Fermez la page
4. Lancez l'application avec `start.bat`
5. ✅ Les 10 pièces sont déjà là !

### MÉTHODE MANUELLE (Si la méthode facile ne marche pas) :
1. Ouvrez l'application (http://localhost:5173)
2. Appuyez sur **F12** (ouvre la console développeur)
3. Allez dans l'onglet **Console**
4. Copiez-collez ce code :

```javascript
localStorage.setItem('tereos_stock', '[{"id":1707834567890,"piece":"Pompe hydraulique Bosch Rexroth A10VSO","refSAP":"SAP-HYD-001","categorie":"Hydraulique","site":"Artenay","co2":120,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567891,"piece":"Vérin pneumatique SMC CDQ2B32-75","refSAP":"SAP-PNE-045","categorie":"Pneumatique","site":"Connantre","co2":80,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567892,"piece":"Moteur électrique 15kW ABB","refSAP":"SAP-ELE-128","categorie":"Électrique","site":"Origny","co2":200,"disponible":false,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567893,"piece":"Réducteur de vitesse SEW Eurodrive","refSAP":"SAP-MEC-067","categorie":"Mécanique","site":"Artenay","co2":150,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567894,"piece":"Automate Siemens S7-1200","refSAP":"SAP-ELC-201","categorie":"Électronique","site":"Connantre","co2":90,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567895,"piece":"Distributeur hydraulique Parker D1VW","refSAP":"SAP-HYD-089","categorie":"Hydraulique","site":"Origny","co2":120,"disponible":true,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567896,"piece":"Compresseur d air Atlas Copco GA5","refSAP":"SAP-PNE-156","categorie":"Pneumatique","site":"Artenay","co2":80,"disponible":false,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567897,"piece":"Variateur de fréquence Schneider ATV320","refSAP":"SAP-ELE-234","categorie":"Électrique","site":"Connantre","co2":200,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567898,"piece":"Roulement SKF 6308-2RS1","refSAP":"SAP-MEC-312","categorie":"Mécanique","site":"Origny","co2":150,"disponible":true,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567899,"piece":"Capteur de température Pt100 Endress+Hauser","refSAP":"SAP-ELC-445","categorie":"Électronique","site":"Artenay","co2":90,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"}]');
```

5. Appuyez sur **Entrée**
6. Rechargez la page (**F5**)
7. ✅ Les pièces apparaissent !

---

## 🛑 ARRÊTER

Fermez les 2 fenêtres de terminal/commande (ou appuyez sur Ctrl+C)

---

## 🔄 RÉINITIALISER LES DONNÉES

Pour effacer toutes les pièces et repartir de zéro :

1. Ouvrez l'application
2. Appuyez sur **F12**
3. Dans la console, tapez : `localStorage.clear()`
4. Appuyez sur **Entrée**
5. Rechargez la page (**F5**)

---

## 📚 DOCUMENTATION COMPLÈTE

- **GUIDE_PRESENTATION.md** - Guide détaillé pour votre présentation
- **README_COMPLET.md** - Documentation technique complète
- **GUIDE_HEBERGEMENT.md** - Pour héberger en production plus tard

---

## ❓ PROBLÈME ?

**"npm n'est pas reconnu"**  
→ Installez Node.js depuis https://nodejs.org

**Le navigateur ne s'ouvre pas**  
→ Allez manuellement sur http://localhost:5173

**Les données ne se sauvegardent pas**  
→ Vérifiez que vous n'êtes pas en mode navigation privée  
→ Vérifiez dans la console (F12) s'il y a des erreurs

**Les données de démo ne chargent pas**  
→ Utilisez la méthode manuelle ci-dessus (copier-coller dans la console)

**Port déjà utilisé**  
→ Redémarrez votre PC

---

## ⏱️ TEMPS NÉCESSAIRE

- **Premier lancement** : 2-3 minutes (installation automatique)
- **Lancements suivants** : 10 secondes
- **Présentation** : Aussi longtemps que vous voulez !

🚀 **C'est parti !**
