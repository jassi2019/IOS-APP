@echo off
echo ========================================
echo   Starting Development Environment
echo ========================================
echo.

echo Step 1: Checking backend directory...
if not exist "backend-main" (
    echo ERROR: backend-main directory not found!
    echo Please make sure you're in the correct directory.
    pause
    exit /b 1
)

echo Step 2: Starting backend server...
echo Opening new terminal for backend...
start cmd /k "cd backend-main && npm start"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Step 3: Starting Expo with cache clear...
echo.
npx expo start --clear

pause
