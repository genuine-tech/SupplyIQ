@echo off
setlocal enabledelayedexpansion
title SupplyChainIQ Launcher

echo ===================================================
echo       SupplyChainIQ Launcher - Starting Up
echo ===================================================
echo.

:: Ensure current working directory is the script root
cd /d "%~dp0"

:: Detect Python executable
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    where py >nul 2>nul
    if %errorlevel% equ 0 (
        set PYTHON_CMD=py
    ) else (
        echo [ERROR] Python was not found in PATH!
        echo Please install Python 3.10+ and add it to your PATH.
        echo Download: https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

echo [OK] Detected Python (%PYTHON_CMD%)

:: Detect Node.js / npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm was not found in PATH!
    echo Please install Node.js and add it to your PATH.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Detected Node.js / npm

:: Check if frontend node_modules exist, install if missing
if not exist "frontend\node_modules\" (
    echo.
    echo [INFO] First time setup: Installing frontend dependencies...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend packages!
        pause
        exit /b 1
    )
    cd ..
)

echo.
echo ===================================================
echo Launching Servers:
echo   [1] FastAPI Backend: http://localhost:8000
echo       API Swagger Docs: http://localhost:8000/docs
echo   [2] React Frontend:  http://localhost:3000
echo ===================================================
echo.

:: Start FastAPI Backend in a separate window
echo Starting FastAPI Backend (Port 8000)...
start "SupplyChainIQ - Backend (Port 8000)" cmd /k "cd /d ""%~dp0"" && %PYTHON_CMD% -m uvicorn backend.app.main:app --reload --port 8000"

:: Brief wait for backend
timeout /t 2 /nobreak >nul

:: Start React Frontend in a separate window
echo Starting React Frontend (Port 3000)...
start "SupplyChainIQ - Frontend (Port 3000)" cmd /k "cd /d ""%~dp0frontend"" && npm start"

echo.
echo Waiting for React Webpack dev server to compile and start...
echo (This takes ~10-15 seconds on initial startup)
echo.

:: Loop to wait until port 3000 is active (up to 30 seconds)
powershell -NoProfile -Command ^
  "$ready = $false; for ($i=0; $i -lt 30; $i++) { " ^
  "  try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { $ready = $true; break } } catch {} " ^
  "  Start-Sleep -Seconds 1; Write-Host '.' -NoNewline; " ^
  "}; " ^
  "if ($ready) { Write-Host ' Ready!' } else { Write-Host ' Timeout waiting, opening browser anyway...' }"

echo.
echo Opening SupplyChainIQ Dashboard in your default browser...
start http://localhost:3000

echo.
echo ===================================================
echo [SUCCESS] SupplyChainIQ is running!
echo   - Web Dashboard: http://localhost:3000
echo   - REST API Docs: http://localhost:8000/docs
echo.
echo Keep both background command windows open while using.
echo To shut down: Close both terminal windows.
echo ===================================================
echo.
pause
