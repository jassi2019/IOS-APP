const Razorpay = require("razorpay");

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require("../config/env");

// Initialize Razorpay only if keys are provided
let rzp = null;

if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  rzp = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay initialized successfully");
} else {
  console.warn("⚠️ Razorpay keys not found. Payment features will be disabled.");
}

const createOrder = async ({ userInfo, price }) => {
  if (!rzp) {
    throw new Error("Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file");
  }

  const order = await rzp.orders
    .create({
      amount: price * 100,
      currency: "INR",
      receipt: "",
      payment_capture: 1,
      notes: userInfo,
    })
    .then((data) => {
      return data;
    });

  return order;
};

module.exports = { createOrder };
