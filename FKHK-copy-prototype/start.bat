@echo off
title FKHK - 1 Click Start
echo ========================================
echo   FKHK Website - Jalanin Aja
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terinstall!
    pause
    exit /b
)

echo Memulai backend...
start "FKHK Backend" cmd /c "cd /d %~dp0backend && node src/index.js"
timeout /t 3 /nobreak >nul

echo Memulai frontend...
start "FKHK Frontend" cmd /c "cd /d %~dp0frontend && npm start"
timeout /t 3 /nobreak >nul

echo.
echo Buka http://localhost:3000 di browser
echo.
echo Tutup jendela ini kalo mau matiin server
pause
