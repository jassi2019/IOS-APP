// Non-Android fallback.
// We keep this file free of any native imports so web/iOS builds don't fail when the
// Android-only native module isn't installed or available.

export function openRazorpay(_options: any) {
  console.warn('Razorpay is only available on Android development/production builds.');
  return Promise.resolve(null);
}

export default {
  openRazorpay,
};

