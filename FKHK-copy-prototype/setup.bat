@echo off
title FKHK - 1 Click Setup
echo ========================================
echo   FKHK Website - Setup Cepat
echo ========================================
echo.

:: Check Node.js, auto install kalo belum ada
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Node.js belum terinstall. Menginstall...
    echo.
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal install otomatis. Download manual:
        echo https://nodejs.org (pilih LTS v18)
        pause
        exit /b
    )
    echo [OK] Node.js berhasil diinstall
    :: refresh PATH
    call refreshenv 2>nul || set PATH=%PATH%;%ProgramFiles%\nodejs\
)
echo [OK] Node.js terdeteksi
node -v

:: Backend
echo.
echo [1/4] Install backend dependencies...
cd /d "%~dp0backend"
call npm install --silent

:: Generate Prisma
echo [2/4] Setup database...
call npx prisma generate 2>nul
call npx prisma db push --accept-data-loss 2>nul

:: Frontend
echo [3/4] Install frontend dependencies...
cd /d "%~dp0frontend"
call npm install --silent

:: Build
echo [4/4] Build frontend...
call npm run build

:: Done
echo.
echo ========================================
echo   SETUP SELESAI!
echo ========================================
echo.
echo Buka 2 jendela terminal:
echo.
echo Terminal 1 - Backend:
echo   cd "%~dp0backend"
echo   node src/index.js
echo.
echo Terminal 2 - Frontend:
echo   cd "%~dp0frontend"
echo   npm start
echo.
echo Lalu buka browser: http://localhost:3000
echo.
pause
