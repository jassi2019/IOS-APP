// Android implementation (requires native module).

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RazorpaySdk = require('react-native-razorpay');

export function openRazorpay(options: any) {
  const Razorpay = RazorpaySdk?.default ?? RazorpaySdk;
  const rzp = new Razorpay(options);
  return rzp.open();
}

export default {
  openRazorpay,
};

