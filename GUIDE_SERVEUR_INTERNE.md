# 🏢 DÉPLOIEMENT SERVEUR INTERNE TEREOS

## Guide rapide pour déployer sur un serveur Windows/Linux interne

---

## 📋 PRÉREQUIS

- Un serveur accessible sur le réseau Tereos
- Accès administrateur au serveur
- Node.js installé (version 16 ou supérieure)

---

## 🪟 INSTALLATION SUR WINDOWS SERVER

### Étape 1 : Installer Node.js

1. Télécharger Node.js LTS depuis https://nodejs.org
2. Exécuter l'installateur
3. Vérifier l'installation :
   ```cmd
   node --version
   npm --version
   ```

### Étape 2 : Copier les fichiers

1. Créer un dossier : `C:\inetpub\tereos-magasins`
2. Copier tous les fichiers du projet dans ce dossier

### Étape 3 : Installer les dépendances

```cmd
cd C:\inetpub\tereos-magasins

REM Installer les dépendances du backend
cd server
npm install --production

REM Installer les dépendances du frontend
cd ..
npm install
```

### Étape 4 : Compiler le frontend

```cmd
npm run build
```

Cela crée un dossier `dist/` avec les fichiers optimisés

### Étape 5 : Installer PM2 (gestionnaire de processus)

```cmd
npm install -g pm2
npm install -g pm2-windows-service

REM Démarrer le backend
cd server
pm2 start index.js --name tereos-api

REM Configurer le démarrage automatique
pm2 save
pm2 startup
pm2-service-install
```

### Étape 6 : Configurer IIS (Internet Information Services)

1. Ouvrir le Gestionnaire IIS
2. Créer un nouveau site :
   - Nom : `Tereos Magasins`
   - Chemin physique : `C:\inetpub\tereos-magasins\dist`
   - Port : 80 (ou 8080 si 80 est occupé)

3. Ajouter un reverse proxy pour l'API :
   - Installer URL Rewrite et ARR (Application Request Routing)
   - Créer une règle de réécriture pour `/api/*` → `http://localhost:3001/api/*`

### Étape 7 : Configurer le pare-feu

```cmd
netsh advfirewall firewall add rule name="Tereos Magasins" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="Tereos API" dir=in action=allow protocol=TCP localport=3001
```

### Étape 8 : Accéder à l'application

Depuis n'importe quel ordinateur du réseau Tereos :
```
http://[IP-DU-SERVEUR]
```

---

## 🐧 INSTALLATION SUR LINUX (UBUNTU/DEBIAN)

### Étape 1 : Installer Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Étape 2 : Créer le dossier et copier les fichiers

```bash
sudo mkdir -p /var/www/tereos-magasins
sudo chown $USER:$USER /var/www/tereos-magasins
cd /var/www/tereos-magasins

# Copier vos fichiers ici
```

### Étape 3 : Installer les dépendances

```bash
cd /var/www/tereos-magasins

# Backend
cd server
npm install --production

# Frontend
cd ..
npm install
npm run build
```

### Étape 4 : Installer et configurer PM2

```bash
sudo npm install -g pm2

cd server
pm2 start index.js --name tereos-api

# Configurer le démarrage automatique
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save
```

### Étape 5 : Installer Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### Étape 6 : Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/tereos-magasins
```

Ajouter cette configuration :

```nginx
server {
    listen 80;
    server_name tereos-magasins.local;  # Ou l'IP du serveur
    
    root /var/www/tereos-magasins/dist;
    index index.html;

    # Logs
    access_log /var/log/nginx/tereos-access.log;
    error_log /var/log/nginx/tereos-error.log;

    # Frontend - tous les fichiers statiques
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend - proxy vers Node.js
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/tereos-magasins /etc/nginx/sites-enabled/
sudo nginx -t  # Tester la configuration
sudo systemctl restart nginx
```

### Étape 7 : Configurer le pare-feu

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Étape 8 : Accéder à l'application

```
http://[IP-DU-SERVEUR]
```

---

## 🔒 SÉCURISATION (RECOMMANDÉ)

### Ajouter HTTPS avec Let's Encrypt (Linux)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tereos-magasins.votredomaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

### Sauvegardes automatiques des données

#### Script de sauvegarde (Windows)
```batch
@echo off
set BACKUP_DIR=D:\Backups\Tereos
set SOURCE=C:\inetpub\tereos-magasins\server\data
set DATE=%DATE:~-4,4%%DATE:~-7,2%%DATE:~-10,2%

mkdir %BACKUP_DIR%\%DATE%
xcopy %SOURCE% %BACKUP_DIR%\%DATE%\ /E /I /Y

echo Sauvegarde effectuée : %DATE%
```

Planifier dans le Planificateur de tâches Windows (tous les jours à 2h du matin)

#### Script de sauvegarde (Linux)
```bash
#!/bin/bash
# /usr/local/bin/backup-tereos.sh

BACKUP_DIR="/backup/tereos"
SOURCE="/var/www/tereos-magasins/server/data"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR/$DATE
cp -r $SOURCE/* $BACKUP_DIR/$DATE/

# Garder seulement les 30 dernières sauvegardes
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;

echo "Sauvegarde effectuée : $DATE"
```

Ajouter dans crontab :
```bash
sudo crontab -e
# Ajouter :
0 2 * * * /usr/local/bin/backup-tereos.sh
```

---

## 📊 MONITORING

### Vérifier l'état du backend (PM2)

```bash
pm2 status
pm2 logs tereos-api
pm2 monit
```

### Vérifier l'état de Nginx (Linux)

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/tereos-access.log
sudo tail -f /var/log/nginx/tereos-error.log
```

---

## 🔧 DÉPANNAGE

### Le backend ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs tereos-api

# Redémarrer
pm2 restart tereos-api

# Si problème persiste, démarrer en mode debug
cd /var/www/tereos-magasins/server
node index.js
```

### Le frontend ne s'affiche pas

```bash
# Vérifier que le build a été fait
ls -la /var/www/tereos-magasins/dist

# Rebuilder si nécessaire
cd /var/www/tereos-magasins
npm run build
```

### Problème de permissions (Linux)

```bash
sudo chown -R www-data:www-data /var/www/tereos-magasins
sudo chmod -R 755 /var/www/tereos-magasins
```

---

## 📱 ACCÈS MOBILE

Pour permettre l'accès depuis téléphones/tablettes sur le réseau Tereos :

1. Noter l'IP du serveur : `ipconfig` (Windows) ou `ip addr` (Linux)
2. Sur mobile, se connecter au WiFi Tereos
3. Ouvrir le navigateur et aller sur : `http://[IP-SERVEUR]`

---

## ✅ CHECKLIST DE MISE EN PRODUCTION

- [ ] Node.js installé (v16+)
- [ ] Fichiers copiés sur le serveur
- [ ] Dépendances installées (`npm install`)
- [ ] Frontend compilé (`npm run build`)
- [ ] Backend démarré avec PM2
- [ ] Nginx/IIS configuré
- [ ] Pare-feu configuré (ports 80, 443)
- [ ] Sauvegardes automatiques configurées
- [ ] Tests d'accès depuis le réseau
- [ ] Documentation fournie à l'équipe IT

---

## 🆘 SUPPORT

En cas de problème :
1. Vérifier les logs : `pm2 logs`
2. Vérifier le statut : `pm2 status`
3. Contacter l'équipe IT Tereos
4. Consulter la documentation complète : README_COMPLET.md

---

**Temps d'installation estimé** : 30-60 minutes
**Maintenance** : 10 minutes/mois (sauvegardes, mises à jour)
