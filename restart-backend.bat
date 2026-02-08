@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
echo.
echo This will restart the backend server to apply the Last Read API fix.
echo.

cd backend-main

echo Stopping any running backend processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server...
echo.
start cmd /k "npm start"

echo.
echo ========================================
echo Backend server is starting in a new window
echo ========================================
echo.
echo Next steps:
echo 1. Wait for the backend to fully start
echo 2. Test the mobile app by navigating between topics
echo 3. Check console for any errors
echo.
pause
