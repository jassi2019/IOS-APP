@echo off
echo ========================================
echo Navigation Fix - Restart with Clear Cache
echo ========================================
echo.
echo This will restart your app with a clean cache
echo to apply the navigation fixes.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Stopping any running Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Clearing Metro bundler cache...
echo.
call npx expo start -c

echo.
echo ========================================
echo App restarted with clear cache!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for the Metro bundler to start
echo 2. Press 'a' for Android or 'i' for iOS
echo 3. Test the navigation flow
echo.
echo Navigation should now work properly:
echo - Home → Chapters → Topics → TopicContent
echo - Back navigation should work
echo - Home screen redirects should work
echo.
pause
