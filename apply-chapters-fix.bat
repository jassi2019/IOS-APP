@echo off
echo ========================================
echo Applying Chapters Screen Alignment Fix
echo ========================================
echo.

echo Backing up original file...
copy src\screens\main\Chapters.tsx src\screens\main\Chapters.tsx.backup
echo Backup created: Chapters.tsx.backup
echo.

echo Applying fixed version...
copy /Y src\screens\main\Chapters_FIXED.tsx src\screens\main\Chapters.tsx
echo Fixed version applied!
echo.

echo Cleaning up...
del src\screens\main\Chapters_FIXED.tsx
echo Temporary file removed.
echo.

echo ========================================
echo Fix Applied Successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your Expo server: npx expo start --clear
echo 2. Test the Chapters screen alignment
echo 3. If you need to revert: copy Chapters.tsx.backup to Chapters.tsx
echo.
pause
