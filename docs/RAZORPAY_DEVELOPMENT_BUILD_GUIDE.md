# Razorpay Payment - Development Build Guide

## ⚠️ Important: Razorpay Requires Development Build

**Razorpay does NOT work in Expo Go!** You need to create a development build to test payment functionality.

---

## Why Development Build is Required?

Razorpay uses native modules (`react-native-razorpay`) that are not available in Expo Go. You need a custom development build that includes these native modules.

---

## Quick Start - Build Development Build

### Option 1: Build Locally (Recommended for Testing)

#### For Android:

```bash
# 1. Install EAS CLI (if not already installed)
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure the project
eas build:configure

# 4. Build development build for Android
eas build --profile development --platform android

# 5. After build completes, download and install the APK on your device
```

#### For iOS:

```bash
# 1. Build development build for iOS
eas build --profile development --platform ios

# 2. After build completes, install on your device via TestFlight or direct installation
```

### Option 2: Use Existing Development Build

If you already have a development build installed:

```bash
# Start the development server
npx expo start --dev-client

# Scan QR code with your development build app
```

---

## Step-by-Step Guide

### Step 1: Check Your EAS Configuration

Your `eas.json` should have a development profile:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_BACKEND_URL": "http://YOUR_IP:8000",
        "EXPO_PUBLIC_RAZORPAY_KEY_ID": "rzp_test_yKCG6OGi329xSM"
      }
    }
  }
}
```

✅ Your project already has this configured!

### Step 2: Build the Development Build

#### For Android (Easiest):

```bash
# Build for Android
eas build --profile development --platform android

# This will:
# 1. Upload your code to EAS servers
# 2. Build a custom APK with Razorpay included
# 3. Provide a download link when complete (usually 10-15 minutes)
```

#### For iOS (Requires Apple Developer Account):

```bash
# Build for iOS
eas build --profile development --platform ios

# This will:
# 1. Upload your code to EAS servers
# 2. Build a custom IPA with Razorpay included
# 3. Provide installation instructions when complete
```

### Step 3: Install the Development Build

#### Android:

1. Download the APK from the EAS build page
2. Transfer to your Android device
3. Install the APK (you may need to enable "Install from Unknown Sources")
4. Open the app

#### iOS:

1. Follow the TestFlight link provided by EAS
2. Install via TestFlight
3. Open the app

### Step 4: Start Development Server

```bash
# Start the dev server
npx expo start --dev-client

# Scan the QR code with your development build app
```

### Step 5: Test Payment

1. Navigate to Profile screen
2. Click "Upgrade To Pro"
3. Select a plan
4. Click "Continue"
5. Click "Pay Now"
6. Razorpay payment screen should open ✅

---

## Alternative: Local Development Build (Advanced)

If you want to build locally without EAS:

### Android:

```bash
# 1. Prebuild the native code
npx expo prebuild --platform android

# 2. Run on Android device/emulator
npx expo run:android
```

### iOS:

```bash
# 1. Prebuild the native code
npx expo prebuild --platform ios

# 2. Open in Xcode and run
cd ios
pod install
cd ..
npx expo run:ios
```

---

## Troubleshooting

### Error: "Razorpay is not available"

**Cause**: You're using Expo Go instead of development build.

**Solution**: Build and install a development build as described above.

### Error: "Build failed"

**Common causes**:

1. **Not logged in to EAS**: Run `eas login`
2. **No EAS project configured**: Run `eas build:configure`
3. **Invalid credentials**: Check your Expo account

### Error: "Cannot install APK"

**Solution**: Enable "Install from Unknown Sources" in Android settings:

1. Go to Settings → Security
2. Enable "Unknown Sources" or "Install Unknown Apps"
3. Try installing again

### Payment Test Mode

Your app is configured with test Razorpay key:

```
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yKCG6OGi329xSM
```

**Test Cards**:

- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

---

## Quick Commands Reference

```bash
# Login to EAS
eas login

# Build development build (Android)
eas build --profile development --platform android

# Build development build (iOS)
eas build --profile development --platform ios

# Start dev server for development build
npx expo start --dev-client

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

---

## What's Different in Development Build?

| Feature            | Expo Go          | Development Build |
| ------------------ | ---------------- | ----------------- |
| Razorpay           | ❌ Not Available | ✅ Works          |
| Native Modules     | ❌ Limited       | ✅ All Supported  |
| Custom Native Code | ❌ No            | ✅ Yes            |
| Build Time         | ⚡ Instant       | 🕐 10-15 mins     |
| Updates            | 🔄 Hot Reload    | 🔄 Hot Reload     |

---

## Production Build (When Ready)

When you're ready to publish:

```bash
# Build for production
eas build --profile production --platform android
eas build --profile production --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## Need Help?

1. **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
2. **Razorpay Integration**: https://razorpay.com/docs/payments/payment-gateway/react-native/
3. **Development Builds**: https://docs.expo.dev/develop/development-builds/introduction/

---

## Summary

✅ **Current Status**: Your app is configured correctly for Razorpay
❌ **Issue**: Expo Go doesn't support Razorpay
✅ **Solution**: Build a development build using EAS

**Next Steps**:

1. Run `eas build --profile development --platform android`
2. Wait 10-15 minutes for build to complete
3. Download and install the APK
4. Run `npx expo start --dev-client`
5. Test payment functionality ✅

**Razorpay payment will work perfectly in the development build! 🚀**
