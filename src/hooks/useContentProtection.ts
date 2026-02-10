import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

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

export function useContentProtection(options: Options = {}) {
  const enabled = options.enabled ?? Platform.OS !== 'web';
  const key = options.key ?? 'default';
  const blurIntensity = options.appSwitcherBlurIntensity ?? 0.6;

  useEffect(() => {
    if (!enabled) return;

    ScreenCapture.preventScreenCaptureAsync(key).catch(() => undefined);

    // Adds an extra layer of privacy for iOS when app goes to background/app switcher.
    if (Platform.OS === 'ios') {
      ScreenCapture.enableAppSwitcherProtectionAsync(blurIntensity).catch(() => undefined);
    }

    return () => {
      ScreenCapture.allowScreenCaptureAsync(key).catch(() => undefined);
      if (Platform.OS === 'ios') {
        ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => undefined);
      }
    };
  }, [enabled, key, blurIntensity]);
}

