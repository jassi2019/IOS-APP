@echo off
echo ========================================
echo iOS Build Automation Script
echo ========================================
echo.

REM Check if EAS CLI is installed
where eas >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing EAS CLI...
    call npm install -g eas-cli
)

echo.
echo Step 1: Logging into EAS...
call eas login

echo.
echo Step 2: Configuring EAS Build...
call eas build:configure

echo.
echo Step 3: Starting iOS Production Build...
echo This will create .ipa file for App Store
call eas build --platform ios --profile production --non-interactive

echo.
echo ========================================
echo Build Started Successfully!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to https://expo.dev
echo 2. Check "Builds" section
echo 3. Wait for build to complete (15-30 mins)
echo 4. Download .ipa file
echo 5. Upload to App Store using Transporter app
echo.
echo ========================================
pause
