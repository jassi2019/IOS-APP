import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';

type Options = {
  enabled?: boolean;
  /**
   * Prevent/allow operations can be keyed so multiple screens can independently
   * enable protection without conflicting with each other.
   */
  key?: string;
  /**
   * iOS-only: blur intensity for app switcher privacy overlay.
   * Range: 0.0 (no blur) .. 1.0 (max blur)
   */
  appSwitcherBlurIntensity?: number;
};

const isExpoGo = Constants.appOwnership === 'expo';

export function useContentProtection(options: Options = {}) {
  const enabled = options.enabled ?? Platform.OS !== 'web';
  const key = options.key ?? 'default';
  const blurIntensity = options.appSwitcherBlurIntensity ?? 0.6;

  useEffect(() => {
    if (!enabled || isExpoGo) return;

    let cleanup = () => {};

    (async () => {
      try {
        const ScreenCapture = await import('expo-screen-capture');
        await ScreenCapture.preventScreenCaptureAsync(key);
        if (
          Platform.OS === 'ios' &&
          typeof ScreenCapture.enableAppSwitcherProtectionAsync === 'function'
        ) {
          await ScreenCapture.enableAppSwitcherProtectionAsync(blurIntensity);
        }
        cleanup = () => {
          ScreenCapture.allowScreenCaptureAsync(key).catch(() => undefined);
          if (
            Platform.OS === 'ios' &&
            typeof ScreenCapture.disableAppSwitcherProtectionAsync === 'function'
          ) {
            ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => undefined);
          }
        };
      } catch {
        // Native module unavailable (Expo Go) — skip
      }
    })();

    return () => cleanup();
  }, [enabled, key, blurIntensity]);
}
