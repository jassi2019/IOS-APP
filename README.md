# Tyari-neet-ios

## Automated migration & linting

I added a small automated script to replace direct imports of native-only modules with web-safe wrappers and an ESLint rule to prevent new direct imports.

- Replace native imports (run locally):

```bash
node scripts/replace-native-imports.js
```

- Run ESLint to verify you don't import native-only packages directly:

```bash
npm run lint
```

Wrappers added:
- `src/libs/razorpay.ts` (use `import { openRazorpay } from '@/libs/razorpay'`)
- `src/libs/iap.ts` (use `import { purchaseAppleSubscription } from '@/libs/iap'`)
- `src/components/PlatformWebView.tsx` (use `import PlatformWebView from '@/components/PlatformWebView'`)

If the script makes changes, review and run `npm run lint` and `expo start` to confirm runtime behavior on Web and Expo Go.
