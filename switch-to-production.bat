@echo off
echo ========================================
echo   Switching to Production Backend
echo ========================================
echo.

echo Creating .env file with production settings...
echo.

(
echo EXPO_PUBLIC_BACKEND_URL=https://api.taiyarineetki.com
echo EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_6DyKHgPSSjdRTe
) > .env

echo ✅ .env file updated successfully!
echo.
echo Configuration:
echo   Backend URL: https://api.taiyarineetki.com
echo   Razorpay Key: rzp_live_6DyKHgPSSjdRTe
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Close any running Expo terminal (Ctrl+C)
echo 2. Run: npx expo start --clear
echo 3. Scan QR code with Expo Go
echo 4. Test registration/login
echo.
echo The app will now connect to the production server!
echo.
pause
