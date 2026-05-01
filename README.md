# Taiyari NEET ki — Android App

NEET preparation mobile app built with React Native + Expo. **Android-only codebase**.

## Tech Stack

- **Framework:** React Native 0.81.5 + Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation (bottom tabs + native stack)
- **Styling:** NativeWind (Tailwind for RN) + StyleSheet
- **State / Data:** TanStack Query, Axios
- **Payments:** react-native-razorpay
- **Auth:** expo-auth-session
- **Content Protection:** expo-screen-capture (FLAG_SECURE)

## Features

- ✅ App-wide screenshot / screen recording block (FLAG_SECURE)
- ✅ 3rd-party recorder apps blocked (XRecorder, AZ Recorder, etc.)
- ✅ Text copy disabled (native + WebView)
- ✅ Recent apps preview hidden
- ✅ Screen mirroring blocked (Chromecast/Miracast)
- ✅ 7 isolated feature content slots per Topic — no mixing
- ✅ Admin-controlled content via Hostinger backend
- ✅ Razorpay payment integration
- ✅ OTA updates configured (expo-updates)

## Project Structure

```
.
├── App.tsx                # App entry point
├── app.json               # Expo config (Android)
├── eas.json               # EAS build profiles
├── android/               # Android native project (Gradle)
├── src/
│   ├── screens/           # All app screens
│   ├── components/        # Reusable UI components
│   ├── navigation/        # Navigators
│   ├── contexts/          # React contexts (Auth, Feature)
│   ├── hooks/             # Custom hooks (api, content protection)
│   ├── lib/               # Axios client, helpers
│   └── constants/         # env, static data
├── assets/                # Images, icons, splash
├── plugins/               # Expo config plugins
└── scripts/               # Build / utility scripts
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for local builds)
- JDK 17
- Expo CLI (`npx expo`)
- EAS CLI for cloud builds (`npm i -g eas-cli`)

## Setup

```bash
# Install dependencies
npm install

# Copy env file and fill values
cp .env.example .env
```

### Required env vars (`.env`)

```
EXPO_PUBLIC_BACKEND_URL=https://api.taiyarineetki.com
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Sk4vSpgDHyeyc4
```

## Run

### Development (Expo Go — limited, no native modules)

```bash
npx expo start --go --lan
```

Scan QR with Expo Go app on phone.

> Note: `react-native-razorpay` and `expo-screen-capture` will not fully work in Expo Go. Use a dev client build for full functionality.

### Android Emulator / Device (USB)

```bash
npx expo run:android
```

## Build for Distribution

### Internal Testing (APK)

```bash
eas build --profile preview --platform android
```

### Play Store (AAB)

```bash
eas build --platform android --profile production
eas submit --platform android --latest
```

### Development Client

```bash
eas build --profile development --platform android
```

## App Identifiers

- **Package:** `com.taiyarineetki.app`
- **Display Name:** Taiyari NEET ki
- **Version:** 1.0.4
- **versionCode:** 4

## Permissions (Android)

Configured in `app.json` → `android.permissions`:

- `INTERNET` — API calls
- `ACCESS_NETWORK_STATE` — connectivity check
- `CAMERA` — uploads / verification
- `READ_EXTERNAL_STORAGE` — pick images
- `WRITE_EXTERNAL_STORAGE` — save downloads

Blocked: `RECORD_AUDIO` (not needed)

## Content Protection

Built using `expo-screen-capture` with **FLAG_SECURE** at the system level. This blocks:

- Native screenshot button
- Built-in screen recording
- All third-party recorder apps
- Screen mirroring (Chromecast, Miracast, etc.)
- Recent apps preview (shows blank)

Activated app-wide via `useContentProtection` hook in `App.tsx`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start Metro bundler |
| `npm run android` | Run on Android device/emulator |
| `npm run lint` | Run ESLint |
| `npm run prebuild` | Regenerate native projects |
| `npm run build:preview` | EAS preview Android build |

## OTA Updates

Future JS-only changes can be pushed without rebuild:

```bash
eas update --branch production --message "your message"
```

App will fetch update on next launch (background).

## License

Proprietary © Taiyari NEET ki
