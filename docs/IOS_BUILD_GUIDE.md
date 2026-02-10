# iOS Build Guide - Apple App Store ke liye

## Prerequisites (Zaroori Cheezein)

### 1. Apple Developer Account

- **Cost**: $99/year
- **Link**: https://developer.apple.com/programs/
- Sign up karein aur payment complete karein

### 2. System Requirements

- **Mac Computer** (Mandatory - iOS build ke liye Mac zaroori hai)
- **Xcode** installed (Latest version)
- **CocoaPods** installed

---

## Step-by-Step iOS Build Process

### Step 1: EAS Build Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure EAS for your project
eas build:configure
```

### Step 2: Update app.json for iOS

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera",
        "NSPhotoLibraryUsageDescription": "This app accesses your photos"
      }
    }
  }
}
```

### Step 3: Create iOS Build

```bash
# Production build for App Store
eas build --platform ios --profile production

# Development build for testing
eas build --platform ios --profile development
```

### Step 4: Download .ipa File

Build complete hone ke baad:

1. EAS dashboard pe jao: https://expo.dev
2. Builds section mein jao
3. Latest iOS build download karo (.ipa file)

---

## App Store Upload Process

### Method 1: Using Transporter App (Recommended)

1. **Download Transporter**

   - Mac App Store se download karo
   - Link: https://apps.apple.com/app/transporter/id1450874784

2. **Upload .ipa File**
   - Transporter app open karo
   - .ipa file drag & drop karo
   - "Deliver" button click karo

### Method 2: Using Xcode

1. Open Xcode
2. Window → Organizer
3. Archives tab
4. "Distribute App" click karo
5. "App Store Connect" select karo
6. Follow the wizard

### Method 3: Using Command Line

```bash
# Install Transporter CLI
xcrun altool --upload-app -f YourApp.ipa -t ios -u your@email.com -p your-app-specific-password
```

---

## App Store Connect Setup

### 1. Create App in App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. "My Apps" → "+" → "New App"
3. Fill details:
   - Platform: iOS
   - Name: Your App Name
   - Primary Language: English
   - Bundle ID: com.yourcompany.yourapp (same as app.json)
   - SKU: unique identifier

### 2. App Information

Fill karo:

- **App Name**: 30 characters max
- **Subtitle**: 30 characters max
- **Privacy Policy URL**: Required
- **Category**: Primary & Secondary
- **Content Rights**: Yes/No

### 3. Pricing and Availability

- **Price**: Free ya Paid
- **Availability**: Countries select karo
- **Pre-orders**: Optional

### 4. App Screenshots Required

**iPhone Screenshots** (Mandatory):

- 6.7" Display (iPhone 14 Pro Max): 1290 x 2796 pixels
- 6.5" Display (iPhone 11 Pro Max): 1242 x 2688 pixels
- 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels

**iPad Screenshots** (If supporting iPad):

- 12.9" Display: 2048 x 2732 pixels
- 11" Display: 1668 x 2388 pixels

### 5. App Preview Video (Optional)

- 15-30 seconds
- .mov, .m4v, or .mp4 format

### 6. Description & Keywords

- **Description**: 4000 characters max
- **Keywords**: 100 characters max (comma separated)
- **Support URL**: Required
- **Marketing URL**: Optional

---

## Build Configuration Files

### eas.json (Create this file)

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false,
        "bundleIdentifier": "com.yourcompany.yourapp"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

---

## Quick Build Script

Create file: `build-ios.bat`

```batch
@echo off
echo ========================================
echo Building iOS App for App Store
echo ========================================

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building iOS app...
call eas build --platform ios --profile production

echo.
echo ========================================
echo Build started! Check EAS dashboard for progress
echo https://expo.dev
echo ========================================
pause
```

---

## Common Issues & Solutions

### Issue 1: "No valid code signing identity found"

**Solution**:

- Apple Developer account mein certificates create karo
- Xcode mein signing setup karo

### Issue 2: "Bundle identifier already exists"

**Solution**:

- app.json mein unique bundle identifier use karo
- Format: com.yourcompany.uniquename

### Issue 3: "Build failed - Missing provisioning profile"

**Solution**:

```bash
eas credentials
# Select iOS
# Select "Set up new credentials"
```

### Issue 4: "App Store Connect API key required"

**Solution**:

- App Store Connect → Users and Access → Keys
- Create new API key
- Download .p8 file
- Add to EAS:

```bash
eas credentials
```

---

## Testing Before Upload

### TestFlight (Internal Testing)

1. Build upload hone ke baad
2. App Store Connect → TestFlight
3. Internal Testing group create karo
4. Testers add karo (email se)
5. Build select karke distribute karo

### External Testing

1. TestFlight → External Testing
2. Beta App Review submit karo
3. Approval ke baad testers ko invite karo

---

## Final Checklist Before Submission

- [ ] App tested on real iOS device
- [ ] All features working properly
- [ ] No crashes or bugs
- [ ] Screenshots ready (all required sizes)
- [ ] App icon ready (1024x1024 px)
- [ ] Privacy Policy URL ready
- [ ] Support URL ready
- [ ] App description written
- [ ] Keywords added
- [ ] Pricing set
- [ ] Age rating completed
- [ ] Export compliance answered

---

## Submission Process

1. **Upload Build**

   - Use Transporter or Xcode
   - Wait for processing (15-30 minutes)

2. **Select Build in App Store Connect**

   - Go to your app
   - Version → Build → Select uploaded build

3. **Submit for Review**

   - Click "Submit for Review"
   - Answer questions
   - Submit

4. **Review Time**

   - Usually 24-48 hours
   - Check status in App Store Connect

5. **After Approval**
   - App automatically goes live
   - Or schedule release date

---

## Important Notes

⚠️ **Mac Computer Zaroori Hai**

- iOS build ke liye Mac mandatory hai
- Windows se direct iOS build nahi ho sakta
- Options:
  1. Mac rent karo (cloud services)
  2. EAS Build use karo (Expo's cloud service - Recommended)
  3. Friend ka Mac use karo

✅ **EAS Build Recommended**

- No Mac needed
- Cloud-based building
- Automatic signing
- Easy to use

💰 **Costs**

- Apple Developer: $99/year
- EAS Build: Free tier available, paid plans for more builds

---

## Quick Commands Reference

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Check build status
eas build:list

# Submit to App Store
eas submit --platform ios

# View credentials
eas credentials

# Update app version
# Edit app.json → version & ios.buildNumber
```

---

## Need Help?

- **Expo Docs**: https://docs.expo.dev/build/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **EAS Build**: https://expo.dev/eas

---

**Good Luck with your App Store submission! 🚀**
