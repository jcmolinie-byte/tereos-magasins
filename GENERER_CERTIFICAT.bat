@echo off
echo.
echo ╔══════════════════════════════════════════╗
echo ║   🔒 Génération du certificat SSL        ║
echo ╚══════════════════════════════════════════╝
echo.

:: Créer le dossier certs
if not exist "tereos_modified\server\certs" mkdir "tereos_modified\server\certs"

:: Vérifier si OpenSSL est disponible
where openssl >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ OpenSSL non trouvé.
    echo.
    echo 👉 Téléchargez OpenSSL ici :
    echo    https://slproweb.com/products/Win32OpenSSL.html
    echo    Installez "Win64 OpenSSL Light" puis relancez ce script.
    pause
    exit /b 1
)

echo ✅ OpenSSL détecté, génération en cours...
echo.

openssl req -x509 -newkey rsa:2048 -keyout "tereos_modified\server\certs\key.pem" -out "tereos_modified\server\certs\cert.pem" -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=IP:192.168.1.26,DNS:localhost"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Certificat généré avec succès !
    echo    Valable 1 an.
    echo.
    echo 👉 Lancez maintenant start.bat
    echo.
    echo ⚠️  Attention : La première fois, votre navigateur
    echo    affichera un avertissement "site non sécurisé".
    echo    Cliquez sur "Paramètres avancés" puis
    echo    "Continuer quand même" — c'est normal pour
    echo    un certificat auto-signé.
) else (
    echo ❌ Erreur lors de la génération du certificat.
)

pause
