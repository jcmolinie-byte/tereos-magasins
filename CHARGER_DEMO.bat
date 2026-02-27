@echo off
echo ========================================
echo   CHARGEMENT DONNEES DE DEMONSTRATION
echo ========================================
echo.
echo Ce script va charger 10 pieces dans votre navigateur.
echo.
pause

echo.
echo Ouverture du navigateur...
echo.
echo INSTRUCTIONS :
echo 1. Une page va s'ouvrir
echo 2. Appuyez sur F12 (ouvre les outils developpeur)
echo 3. Cliquez sur l'onglet "Console" en haut
echo 4. Copiez-collez le code qui s'affichera
echo 5. Appuyez sur Entree
echo 6. Rechargez la page (F5)
echo.
pause

REM Créer une page HTML temporaire avec le code
echo ^<!DOCTYPE html^> > temp_load.html
echo ^<html^>^<head^>^<meta charset="UTF-8"^>^<title^>Chargement donnees^</title^> >> temp_load.html
echo ^<style^> >> temp_load.html
echo body { font-family: Arial; padding: 40px; background: #f0f0f0; } >> temp_load.html
echo .container { background: white; padding: 30px; border-radius: 10px; max-width: 800px; margin: 0 auto; } >> temp_load.html
echo h1 { color: #333; } >> temp_load.html
echo .code-box { background: #1e1e1e; color: #00ff00; padding: 20px; border-radius: 5px; overflow-x: auto; margin: 20px 0; } >> temp_load.html
echo .step { background: #e3f2fd; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; } >> temp_load.html
echo button { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin: 10px 5px; } >> temp_load.html
echo button:hover { background: #45a049; } >> temp_load.html
echo .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; } >> temp_load.html
echo ^</style^>^</head^>^<body^> >> temp_load.html
echo ^<div class="container"^> >> temp_load.html
echo ^<h1^>📦 Chargement des donnees de demonstration^</h1^> >> temp_load.html
echo ^<div class="warning"^>^<strong^>⚠️ IMPORTANT :^</strong^> Suivez ces etapes dans l'ordre !^</div^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 1 :^</strong^> Appuyez sur ^<strong^>F12^</strong^> (ouvre les outils developpeur)^</div^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 2 :^</strong^> Cliquez sur l'onglet ^<strong^>"Console"^</strong^> en haut^</div^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 3 :^</strong^> Cliquez sur le bouton ci-dessous pour copier le code^</div^> >> temp_load.html
echo ^<button onclick="copyCode()"^>📋 Copier le code^</button^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 4 :^</strong^> Collez le code dans la console (Ctrl+V) et appuyez sur ^<strong^>Entree^</strong^>^</div^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 5 :^</strong^> Vous verrez "✅ 10 pieces chargees !" - Fermez cette page^</div^> >> temp_load.html
echo ^<div class="step"^>^<strong^>ETAPE 6 :^</strong^> Lancez l'application avec start.bat^</div^> >> temp_load.html
echo ^<h3^>Code a copier :^</h3^> >> temp_load.html
echo ^<div class="code-box" id="codeBox"^>localStorage.setItem('tereos_stock', JSON.stringify([{"id":1707834567890,"piece":"Pompe hydraulique Bosch Rexroth A10VSO","refSAP":"SAP-HYD-001","categorie":"Hydraulique","site":"Artenay","co2":120,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567891,"piece":"Verin pneumatique SMC CDQ2B32-75","refSAP":"SAP-PNE-045","categorie":"Pneumatique","site":"Connantre","co2":80,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567892,"piece":"Moteur electrique 15kW ABB","refSAP":"SAP-ELE-128","categorie":"Electrique","site":"Origny","co2":200,"disponible":false,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567893,"piece":"Reducteur de vitesse SEW Eurodrive","refSAP":"SAP-MEC-067","categorie":"Mecanique","site":"Artenay","co2":150,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567894,"piece":"Automate Siemens S7-1200","refSAP":"SAP-ELC-201","categorie":"Electronique","site":"Connantre","co2":90,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567895,"piece":"Distributeur hydraulique Parker D1VW","refSAP":"SAP-HYD-089","categorie":"Hydraulique","site":"Origny","co2":120,"disponible":true,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567896,"piece":"Compresseur air Atlas Copco GA5","refSAP":"SAP-PNE-156","categorie":"Pneumatique","site":"Artenay","co2":80,"disponible":false,"ownerEmail":"magasin.artenay@tereos.com"},{"id":1707834567897,"piece":"Variateur frequence Schneider ATV320","refSAP":"SAP-ELE-234","categorie":"Electrique","site":"Connantre","co2":200,"disponible":true,"ownerEmail":"magasin.connantre@tereos.com"},{"id":1707834567898,"piece":"Roulement SKF 6308-2RS1","refSAP":"SAP-MEC-312","categorie":"Mecanique","site":"Origny","co2":150,"disponible":true,"ownerEmail":"magasin.origny@tereos.com"},{"id":1707834567899,"piece":"Capteur temperature Pt100 Endress+Hauser","refSAP":"SAP-ELC-445","categorie":"Electronique","site":"Artenay","co2":90,"disponible":true,"ownerEmail":"magasin.artenay@tereos.com"}])); console.log('✅ 10 pieces chargees !');^</div^> >> temp_load.html
echo ^<script^> >> temp_load.html
echo function copyCode() { >> temp_load.html
echo   const code = document.getElementById('codeBox').innerText; >> temp_load.html
echo   navigator.clipboard.writeText(code).then(() =^> { >> temp_load.html
echo     alert('✅ Code copie ! Maintenant collez-le dans la Console (F12) et appuyez sur Entree'); >> temp_load.html
echo   }); >> temp_load.html
echo } >> temp_load.html
echo ^</script^>^</body^>^</html^> >> temp_load.html

start temp_load.html

echo.
echo ========================================
echo Page ouverte dans le navigateur !
echo Suivez les instructions affichees.
echo ========================================
echo.
pause

del temp_load.html
