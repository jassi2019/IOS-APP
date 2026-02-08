# Razorpay iOS Development Build Guide - Complete Setup

## 1. Why Razorpay Does NOT Work in Expo Go on iOS

### Technical Reasons:

**Native Module Requirement:**

- Razorpay SDK (`react-native-razorpay`) contains native iOS code (Swift/Objective-C)
- Expo Go is a pre-built app that only includes a limited set of native modules
- Custom native modules like Razorpay are NOT included in Expo Go

**iOS Specific Issues:**

- Razorpay requires native iOS frameworks and entitlements
- Payment processing requires specific iOS capabilities (e.g., URL schemes, deep linking)
- These capabilities cannot be added to Expo Go dynamically

**Solution:**
You MUST create a custom development build that includes the Razorpay native module.

---

## 2. Apple Developer Account Requirements

### Free Account (Limited):

✅ **What You Can Do:**

- Create development builds
- Install on your own device (up to 3 devices)
- Test for 7 days (then need to rebuild)

❌ **Limitations:**

- Cannot distribute via TestFlight
- Cannot publish to App Store
- Builds expire after 7 days
- Limited to 3 devices

### Paid Account ($99/year):

✅ **What You Can Do:**

- Everything from free account
- Distribute via TestFlight (up to 10,000 testers)
- Publish to App Store
- No expiration on builds
- Unlimited devices for testing

**Recommendation:** Start with free account for testing, upgrade to paid when ready for distribution.

---

## 3. Prerequisites

### Install Required Tools:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to Expo account
eas login

# 3. Verify installation
eas --version
```

### Apple Developer Setup:

1. **Create Apple ID** (if you don't have one):

   - Go to https://appleid.apple.com
   - Create account

2. **Enroll in Apple Developer Program** (optional for testing):

   - Go to https://developer.apple.com
   - Enroll (free or paid)

3. **Install Xcode** (required for iOS builds):
   ```bash
   # Download from Mac App Store
   # OR use command line
   xcode-select --install
   ```

---

## 4. Project Configuration

### Step 1: Update app.json

```json
{
  "expo": {
    "name": "Taiyari NEET ki",
    "slug": "taiyarineetki",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.taiyarineetki.app",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["razorpay"],
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### Step 2: Update eas.json

```json
{
  "cli": {
    "version": ">= 14.4.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_BACKEND_URL": "http://YOUR_IP:8000",
        "EXPO_PUBLIC_RAZORPAY_KEY_ID": "rzp_test_yKCG6OGi329xSM"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_BACKEND_URL": "https://api.taiyarineetki.com",
        "EXPO_PUBLIC_RAZORPAY_KEY_ID": "rzp_live_6DyKHgPSSjdRTe"
      }
    },
    "production": {
      "autoIncrement": true,
      "ios": {
        "resourceClass": "m-medium"
      },
      "env": {
        "EXPO_PUBLIC_BACKEND_URL": "https://api.taiyarineetki.com",
        "EXPO_PUBLIC_RAZORPAY_KEY_ID": "rzp_live_6DyKHgPSSjdRTe"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 3: Verify package.json

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "react-native-razorpay": "^2.3.1",
    "expo-dev-client": "~6.0.0"
  }
}
```

If `expo-dev-client` is missing:

```bash
npx expo install expo-dev-client
```

---

## 5. Build iOS Development Build

### Step 1: Configure EAS Project

```bash
# Initialize EAS in your project
eas build:configure
```

This will:

- Create `eas.json` if it doesn't exist
- Link your project to EAS
- Generate a project ID

### Step 2: Build for iOS (Development)

```bash
# Build development build for iOS
eas build --profile development --platform ios
```

**What Happens:**

1. EAS uploads your code to cloud
2. Installs all dependencies including Razorpay
3. Compiles native iOS code
4. Creates an IPA file
5. Provides download link (usually takes 15-20 minutes)

**Expected Output:**

```
✔ Build finished
Build ID: abc123-def456-ghi789
Build URL: https://expo.dev/accounts/YOUR_ACCOUNT/projects/YOUR_PROJECT/builds/BUILD_ID

Install on device:
- Download IPA from build page
- Install using Apple Configurator or Xcode
```

### Step 3: Alternative - Local Build (Advanced)

If you prefer building locally:

```bash
# Prebuild native iOS project
npx expo prebuild --platform ios

# Open in Xcode
cd ios
open taiyarineetki.xcworkspace

# Build and run from Xcode
# Select your device and click Run
```

---

## 6. Install on Real iPhone

### Method 1: Using EAS Build Page (Easiest)

1. **Open Build URL on iPhone:**

   - EAS will send you a link after build completes
   - Open link in Safari on your iPhone
   - Tap "Install"

2. **Trust Developer Certificate:**

   - Go to Settings → General → VPN & Device Management
   - Tap on your developer certificate
   - Tap "Trust"

3. **Open App:**
   - App icon will appear on home screen
   - Launch the app

### Method 2: Using Apple Configurator (Mac Required)

1. **Download IPA:**

   ```bash
   # Download from EAS build page
   # Save to your Mac
   ```

2. **Install Apple Configurator:**

   - Download from Mac App Store
   - Open Apple Configurator

3. **Connect iPhone:**

   - Connect iPhone to Mac via USB
   - Trust computer on iPhone

4. **Install IPA:**
   - Drag IPA file onto your device in Apple Configurator
   - Wait for installation to complete

### Method 3: Using Xcode (Mac Required)

1. **Download IPA:**

   ```bash
   # Download from EAS build page
   ```

2. **Open Xcode:**

   ```bash
   # Open Xcode
   # Go to Window → Devices and Simulators
   ```

3. **Connect iPhone:**

   - Connect iPhone via USB
   - Select your device

4. **Install IPA:**
   - Click "+" button
   - Select downloaded IPA
   - Wait for installation

---

## 7. Run Development Server

### Start Expo Dev Server:

```bash
# Start development server
npx expo start --dev-client

# You should see:
# › Metro waiting on exp://192.168.1.X:8081
# › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Connect iPhone to Dev Server:

**Option 1: QR Code (Recommended)**

1. Open the development build app on iPhone
2. Tap "Scan QR Code"
3. Scan the QR code from terminal
4. App will connect and load

**Option 2: Manual URL**

1. Open development build app
2. Tap "Enter URL manually"
3. Enter: `exp://YOUR_IP:8081`
4. Tap "Connect"

**Option 3: Shake to Open Menu**

1. Open development build app
2. Shake your iPhone
3. Tap "Scan QR Code" or "Enter URL"

---

## 8. Razorpay iOS Integration

### Minimal Working Example:

```typescript
// src/hooks/api/payment.ts
import env from '@/constants/env';
import { Platform } from 'react-native';

// Conditionally import Razorpay
let RazorpayCheckout: any = null;

try {
  if (Platform.OS !== 'web') {
    const razorpay = require('react-native-razorpay');
    RazorpayCheckout = razorpay.default;
  }
} catch (error) {
  console.warn('Razorpay module not available');
}

export const initiateRazorpayPayment = async ({
  order,
  plan,
}: {
  order: {
    id: string;
    amount: number;
    currency: string;
    notes: { email: string; name: string };
  };
  plan: { name: string };
}) => {
  // Check if Razorpay is available
  if (!RazorpayCheckout) {
    throw new Error('Razorpay is not available. Please use a development build.');
  }

  // iOS-specific options
  const options: any = {
    description: `Payment for ${plan.name} plan`,
    image: 'https://your-app-logo-url.png', // Your app logo
    currency: order.currency,
    key: env.razorpayKeyId,
    amount: order.amount,
    name: 'Taiyari NEET ki',
    order_id: order.id,
    prefill: {
      email: order.notes.email,
      name: order.notes.name,
    },
    theme: {
      color: '#F1BB3E',
      // iOS-specific theme options
      hide_topbar: false,
    },
  };

  try {
    const data = await RazorpayCheckout.open(options);

    return {
      paymentId: data.razorpay_payment_id,
      orderId: data.razorpay_order_id,
      signature: data.razorpay_signature,
    };
  } catch (error: any) {
    // Handle iOS-specific errors
    if (error.code === 'PAYMENT_CANCELLED') {
      throw new Error('Payment was cancelled by user');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error?.description || 'Payment failed');
    }
  }
};
```

### iOS-Specific Error Handling:

```typescript
// src/screens/main/Payment.tsx
const handlePayment = async () => {
  try {
    // Check platform
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This feature is only available on iOS');
      return;
    }

    // Create order
    const order = await createOrderAsync(plan.id);

    if (!order || !order.data) {
      throw new Error('Order creation failed');
    }

    // Initiate Razorpay payment
    const paymentResult = await initiateRazorpayPayment({
      order: order.data,
      plan,
    });

    // Create subscription
    createSubscription(
      {
        ...paymentResult,
        planId: plan.id,
      },
      {
        onSuccess: () => {
          navigation.navigate('SubscriptionMessage', {
            success: true,
            plan,
          });
        },
        onError: (error: any) => {
          Alert.alert('Subscription Error', error?.message || 'Failed to create subscription');
        },
      }
    );
  } catch (error: any) {
    console.error('Payment error:', error);

    // iOS-specific error messages
    let errorMessage = 'Payment failed. Please try again.';

    if (error?.message?.includes('Razorpay is not available')) {
      errorMessage =
        'Razorpay requires a development build.\n\n' +
        'You are using Expo Go which does not support Razorpay.\n\n' +
        'Please build and install the development build.';
    } else if (error?.message?.includes('cancelled')) {
      errorMessage = 'Payment was cancelled.';
    } else if (error?.message?.includes('Network')) {
      errorMessage = 'Network error. Please check your connection.';
    }

    Alert.alert('Payment Error', errorMessage);
  }
};
```

---

## 9. iOS-Specific Permissions & Configuration

### Required Info.plist Entries:

Already configured in `app.json`:

```json
"ios": {
  "infoPlist": {
    "LSApplicationQueriesSchemes": [
      "razorpay"
    ],
    "NSAppTransportSecurity": {
      "NSAllowsArbitraryLoads": true
    }
  }
}
```

**What These Do:**

- `LSApplicationQueriesSchemes`: Allows app to open Razorpay URLs
- `NSAppTransportSecurity`: Allows HTTP connections (for development)

### URL Scheme Configuration:

Add to `app.json`:

```json
"ios": {
  "bundleIdentifier": "com.taiyarineetki.app",
  "scheme": "taiyarineetki"
}
```

This allows deep linking back to your app after payment.

---

## 10. Common iOS-Specific Mistakes

### ❌ Mistake 1: Using Expo Go

```bash
# Wrong
npx expo start
# Opens in Expo Go - Razorpay won't work
```

```bash
# Correct
npx expo start --dev-client
# Opens in development build - Razorpay works
```

### ❌ Mistake 2: Building for Simulator

```json
// Wrong - eas.json
"ios": {
  "simulator": true  // ❌ Can't test payments on simulator
}
```

```json
// Correct - eas.json
"ios": {
  "simulator": false  // ✅ Build for real device
}
```

### ❌ Mistake 3: Missing URL Scheme

```json
// Wrong - app.json
"ios": {
  "bundleIdentifier": "com.app.name"
  // Missing scheme
}
```

```json
// Correct - app.json
"ios": {
  "bundleIdentifier": "com.app.name",
  "scheme": "appname"  // ✅ Required for deep linking
}
```

### ❌ Mistake 4: Not Handling iOS-Specific Errors

```typescript
// Wrong
catch (error) {
  console.log(error);  // ❌ Generic error handling
}
```

```typescript
// Correct
catch (error: any) {
  if (error.code === 'PAYMENT_CANCELLED') {
    // Handle cancellation
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network error
  } else {
    // Handle other errors
  }
}
```

### ❌ Mistake 5: Not Trusting Developer Certificate

After installing app, you must:

1. Go to Settings → General → VPN & Device Management
2. Tap on your certificate
3. Tap "Trust"

Without this, app won't open.

### ❌ Mistake 6: Using Wrong Razorpay Key

```typescript
// Wrong
key: 'rzp_live_xxx'; // ❌ Using live key in development
```

```typescript
// Correct
key: env.razorpayKeyId; // ✅ Use test key in development
// rzp_test_yKCG6OGi329xSM
```

### ❌ Mistake 7: Not Checking Platform

```typescript
// Wrong
RazorpayCheckout.open(options); // ❌ Might crash on web
```

```typescript
// Correct
if (Platform.OS === 'ios' && RazorpayCheckout) {
  RazorpayCheckout.open(options); // ✅ Platform check
}
```

### ❌ Mistake 8: Forgetting to Rebuild After Changes

After changing native configuration:

```bash
# Must rebuild
eas build --profile development --platform ios
```

---

## 11. Testing Razorpay on iOS

### Test Cards (Razorpay Test Mode):

**Credit Card:**

- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Debit Card:**

- Card Number: `5104 0600 0000 0008`
- CVV: Any 3 digits
- Expiry: Any future date

**UPI:**

- UPI ID: `success@razorpay`
- OTP: `123456`

**Net Banking:**

- Select any bank
- Use test credentials provided by Razorpay

### Test Flow:

1. **Open App:**

   ```bash
   npx expo start --dev-client
   # Scan QR code with development build
   ```

2. **Navigate to Payment:**

   - Go to Profile
   - Click "Upgrade To Pro"
   - Select a plan
   - Click "Continue"
   - Click "Pay Now"

3. **Razorpay Opens:**

   - Should see Razorpay payment screen
   - Select payment method
   - Enter test card details
   - Complete payment

4. **Verify Success:**
   - Should return to app
   - Should see success message
   - Check subscription status

---

## 12. Troubleshooting

### Issue: "Razorpay is not available"

**Solution:**

```bash
# 1. Verify you're using development build, not Expo Go
# 2. Rebuild the app
eas build --profile development --platform ios

# 3. Reinstall on device
# 4. Restart dev server
npx expo start --dev-client --clear
```

### Issue: "App won't install on iPhone"

**Solution:**

1. Check Apple Developer account is active
2. Trust developer certificate in Settings
3. Try different installation method (Apple Configurator)
4. Check device is registered in Apple Developer portal

### Issue: "Payment screen doesn't open"

**Solution:**

1. Check Razorpay key is correct
2. Verify URL scheme in app.json
3. Check LSApplicationQueriesSchemes in Info.plist
4. Rebuild app after configuration changes

### Issue: "Build fails on EAS"

**Solution:**

```bash
# 1. Check eas.json configuration
# 2. Verify package.json dependencies
# 3. Clear EAS cache
eas build --profile development --platform ios --clear-cache

# 4. Check build logs
eas build:list
eas build:view BUILD_ID
```

### Issue: "Can't connect to dev server"

**Solution:**

1. Ensure iPhone and computer on same WiFi
2. Check firewall isn't blocking port 8081
3. Use manual URL: `exp://YOUR_IP:8081`
4. Restart dev server with `--clear` flag

---

## 13. Production Build (When Ready)

### Step 1: Update Configuration

```json
// eas.json
"production": {
  "autoIncrement": true,
  "ios": {
    "resourceClass": "m-medium"
  },
  "env": {
    "EXPO_PUBLIC_BACKEND_URL": "https://api.taiyarineetki.com",
    "EXPO_PUBLIC_RAZORPAY_KEY_ID": "rzp_live_6DyKHgPSSjdRTe"
  }
}
```

### Step 2: Build for Production

```bash
# Build production version
eas build --profile production --platform ios
```

### Step 3: Submit to App Store

```bash
# Submit to App Store
eas submit --platform ios
```

---

## 14. Final Checklist

### Before Building:

- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into Expo (`eas login`)
- [ ] Apple Developer account created
- [ ] `app.json` configured with iOS settings
- [ ] `eas.json` configured with development profile
- [ ] `expo-dev-client` installed
- [ ] `react-native-razorpay` installed
- [ ] Razorpay test key configured

### Building:

- [ ] Run `eas build --profile development --platform ios`
- [ ] Wait for build to complete (15-20 minutes)
- [ ] Download IPA from build page

### Installing:

- [ ] Install IPA on iPhone using one of the methods
- [ ] Trust developer certificate in Settings
- [ ] Open app successfully

### Testing:

- [ ] Start dev server (`npx expo start --dev-client`)
- [ ] Connect iPhone to dev server (scan QR code)
- [ ] Navigate to payment screen
- [ ] Click "Pay Now"
- [ ] Razorpay payment screen opens
- [ ] Complete test payment
- [ ] Verify payment success

### Production (When Ready):

- [ ] Update to live Razorpay key
- [ ] Update backend URL to production
- [ ] Build production version
- [ ] Test thoroughly
- [ ] Submit to App Store

---

## 15. Quick Commands Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build development build for iOS
eas build --profile development --platform ios

# Build with cache clear
eas build --profile development --platform ios --clear-cache

# Check build status
eas build:list

# View build details
eas build:view BUILD_ID

# Start dev server
npx expo start --dev-client

# Start dev server with cache clear
npx expo start --dev-client --clear

# Build for production
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## Summary

**Razorpay on iOS requires:**

1. ✅ Development build (NOT Expo Go)
2. ✅ Real iPhone (NOT simulator)
3. ✅ Proper iOS configuration (URL schemes, permissions)
4. ✅ Apple Developer account (free or paid)
5. ✅ EAS CLI for building
6. ✅ Correct Razorpay integration code

**Build Time:** 15-20 minutes
**Installation:** 5-10 minutes
**Testing:** Immediate after installation

**Total Time to Get Razorpay Working on iOS:** ~30 minutes

**Ab iOS par bhi Razorpay perfectly kaam karega! 🎉**
