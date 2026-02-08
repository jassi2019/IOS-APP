# iOS Setup (Expo Managed)

Quick steps to run this project on iOS Simulator (macOS required):

1. Upgrade/Install Expo CLI (optional but recommended):
   - npm install -g expo-cli
2. Install dependencies:
   - npm install
   - expo install react-native-gesture-handler react-native-screens react-native-safe-area-context react-native-reanimated expo-status-bar expo-screen-capture @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @tanstack/react-query nativewind react-native-svg react-native-webview @expo/vector-icons
3. Configure Reanimated (already added to `babel.config.js`). Ensure you restart Metro.
4. Run on iOS simulator:
   - expo start
   - Press 'i' to open iOS simulator, or run `expo run:ios` (requires Xcode and macOS)

If you want to build signed IPA using EAS:
1. Install EAS CLI (if not already):
   - npm install -g eas-cli
2. Login: `eas login`
3. Build:
   - eas build --platform ios --profile preview

Notes:
- Some native libraries require prebuilding or EAS (e.g., `react-native-razorpay`). Use `eas build` or `expo prebuild` to generate native projects as needed.
- I added `bundleIdentifier` in `app.json` under `ios`. Update it to your company/organization ID.

## Native module audit (iOS readiness)

- react-native-reanimated: compatible with Expo, **requires** the Reanimated Babel plugin (already added to `babel.config.js`). On iOS, ensure you run `expo prebuild` or EAS builds when adding Reanimated features.

- react-native-gesture-handler: compatible with Expo managed workflow. Import `react-native-gesture-handler` at top-level (already done in `src/App.tsx`).

- react-native-screens & react-native-safe-area-context: compatible and required for navigation performance; `enableScreens()` is enabled.

- react-native-webview: works in managed workflow but needs prebuild/EAS for native code. Use EAS for production builds.

- react-native-razorpay: not an Expo unimodule; requires a prebuild and native configuration for iOS (add the iOS SDK and configure URL types, Info.plist entries, and Podspec). Recommended actions:
  - Option A: Use EAS Build (recommended) and run `expo prebuild` locally to inspect native changes, then run `pod install` in `ios`.
  - Option B: Replace with a JS-based payment SDK (if acceptable) to avoid native setup for now.

- react-native-linear-gradient: REMOVED (we prefer `expo-linear-gradient` which is already present).

## EAS & prebuild steps (recommended)

1. Run `npm install` (or `yarn`).
2. Run `expo prebuild` to generate native iOS and Android projects. Inspect `ios/` folder and run `npx pod-install` inside `ios`.
3. For a quick cloud build (no macOS needed): `eas build --platform ios --profile preview`.
4. If any native module requires extra Info.plist or plist changes, add them via config plugins or edit `app.json` `expo.ios.infoPlist`.

I added an example GitHub Actions workflow (`.github/workflows/eas-build.yml`) to trigger `eas build` on push. I also included a small config plugin stub at `plugins/withRazorpayConfig.js` that adds a URL scheme and a query scheme on iOS — you'll still need to verify Razorpay-specific keys and settings in Xcode.

---

## Recommended next steps (you run locally)

1. Install Node & npm (LTS) and run `npm install`.
2. Run `npx expo doctor` and `npx tsc --noEmit` and paste any errors here if failures occur.
3. Optional (upgrade Expo SDK): run `npx expo upgrade` to move to the latest Expo SDK — follow the prompts and check the release notes for breaking changes.
4. If you need Razorpay, run `expo prebuild` and then `npx pod-install` inside `ios/` to ensure the native SDK is linked.
5. Use `eas build` for iOS to avoid needing a local macOS build environment (see `.github/workflows/eas-build.yml` for automation).

If you'd like, I can run the upgrade locally in the repo (bump packages, fix breaking TypeScript issues) but I'll need you to run `npm install` and paste `npx tsc --noEmit` outputs so I can fix anything left.

