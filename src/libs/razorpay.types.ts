export type TRazorpayPaymentResult = {
  razorpay_payment_id?: string;
  payment_id?: string;
  razorpay_order_id?: string;
  order_id?: string;
  razorpay_signature?: string;
  signature?: string;
};

export type TRazorpayOptions = Record<string, unknown>;

