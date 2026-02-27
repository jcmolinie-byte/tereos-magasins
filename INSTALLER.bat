@echo off
echo ========================================
echo   INSTALLATION TEREOS MAGASINS
echo ========================================
echo.
echo Ce script va installer toutes les dependances necessaires.
echo Cela peut prendre 2-3 minutes...
echo.
pause

echo.
echo [1/3] Installation des dependances du BACKEND...
cd server
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors de l'installation du backend !
    echo Verifiez que Node.js est bien installe : https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/3] Installation des dependances du FRONTEND...
cd ..
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors de l'installation du frontend !
    pause
    exit /b 1
)

echo.
echo [3/3] Creation du dossier de donnees...
if not exist "server\data" mkdir server\data
echo {"stock":[],"users":[]} > server\data\stock.json

echo.
echo ========================================
echo   INSTALLATION TERMINEE !
echo ========================================
echo.
echo Prochaine etape :
echo   1. Double-cliquez sur "start.bat" pour demarrer
echo   2. Attendez 10 secondes
echo   3. Le navigateur s'ouvrira automatiquement
echo.
echo Vos donnees seront sauvegardees dans : server\data\stock.json
echo.
pause
