@echo off
echo ========================================
echo  RESTARTING REACT NATIVE APP
echo ========================================
echo.

echo [1/3] Stopping any running Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Clearing Metro cache...
call npx expo start --clear --no-dev --minify

echo.
echo ========================================
echo  APP RESTARTED!
echo ========================================
echo.
echo Press 'i' for iOS simulator
echo Press 'a' for Android emulator
echo Press 'r' to reload the app
echo.
pause
