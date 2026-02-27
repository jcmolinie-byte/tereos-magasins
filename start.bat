@echo off
echo ========================================
echo   DEMARRAGE TEREOS MAGASINS
echo ========================================
echo.

REM Vérifier si node_modules existe dans le dossier racine
if not exist "node_modules\" (
    echo Installation des dependances frontend...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERREUR: Node.js n'est pas installe !
        echo Telechargez-le sur https://nodejs.org
        pause
        exit /b 1
    )
)

REM Vérifier si node_modules existe dans server
if not exist "server\node_modules\" (
    echo Installation des dependances backend...
    cd server
    call npm install
    cd ..
)

echo.
echo Demarrage de l'application...
echo.

REM Demarrage du backend (serveur API + IA DeepSeek)
echo [1/2] Demarrage du serveur backend (port 3001)...
start "Backend Tereos" cmd /k "cd server && node index.js"

REM Attendre 2 secondes que le backend soit pret
timeout /t 2 /nobreak > nul

REM Demarrage du frontend
echo [2/2] Demarrage du frontend (port 5173)...
start "Frontend Tereos" cmd /k "npm run dev"

echo.
echo ========================================
echo   Application en cours de demarrage !
echo   Backend  : http://localhost:3001
echo   Frontend : http://localhost:5173
echo   IA CO2   : DeepSeek ACTIVE
echo ========================================
echo.
echo Deux fenetres se sont ouvertes (backend + frontend).
echo Ne les fermez pas pendant l'utilisation.
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
