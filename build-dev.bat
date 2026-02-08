@echo off
echo ========================================
echo Building Development Build for Android
echo ========================================
echo.
echo This will create a custom APK build that includes native modules (e.g., In-App Purchases).
echo The build will take approximately 10-15 minutes.
echo.
echo Make sure you are logged in to EAS CLI.
echo If not, run: eas login
echo.
pause

echo.
echo Starting build...
echo.

call eas build --profile development --platform android

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Download the APK from the link above
echo 2. Install it on your Android device
echo 3. Run: npx expo start --dev-client
echo 4. Scan QR code with your development build app
echo.
echo Development build is ready.
echo.
pause

