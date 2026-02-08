import { Platform } from 'react-native';

let RazorpaySdk: any = null;
if (Platform.OS !== 'web') {
  try {
    // lazy require so web doesn't evaluate native code
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    RazorpaySdk = require('react-native-razorpay');
  } catch (e) {
    // module missing in dev environment - will be handled by callers
    RazorpaySdk = null;
  }
}

export function openRazorpay(options: any) {
  if (RazorpaySdk && RazorpaySdk.default) {
    const Razorpay = RazorpaySdk.default;
    const rzp = new Razorpay(options);
    return rzp.open();
  }

  // Web or missing native SDK fallback
  console.warn('Razorpay not available on this platform; falling back.');
  return Promise.resolve(null);
}

export default {
  openRazorpay,
};
