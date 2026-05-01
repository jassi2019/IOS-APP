// Android implementation (requires native module).

import type { TRazorpayOptions, TRazorpayPaymentResult } from './razorpay.types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RazorpaySdk = require('react-native-razorpay');

export function openRazorpay(options: TRazorpayOptions): Promise<TRazorpayPaymentResult> {
  const Razorpay = RazorpaySdk?.default ?? RazorpaySdk;
  return Razorpay.open(options) as Promise<TRazorpayPaymentResult>;
}

export default {
  openRazorpay,
};
