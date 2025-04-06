@echo off
:: =============================================================================
:: run.bat – Setup & Start Script for Film Fusion
:: =============================================================================
:: This script installs all dependencies and launches the dev server.
:: Usage: Run it from the terminal (Windows only).
:: =============================================================================

echo Installing dependencies...
call npm install

echo.
echo Starting the development server...
call npm run dev

echo.
echo
