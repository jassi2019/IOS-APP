const crypto = require("crypto");

const env = require("../../config/env");
const { Subscription, Plan } = require("../../models");
const { PAYMENT_PLATFORMS, PAYMENT_STATUSES } = require("../../constants");
const { sendPurchaseNotification } = require("../../utils/billing");

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (!env.RAZORPAY_KEY_SECRET) {
    return {
      ok: false,
      reason: "Razorpay is not configured on the server.",
    };
  }

  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return {
    ok: expected === signature,
    reason: expected === signature ? null : "Invalid Razorpay signature.",
  };
};

const createV1 = async (req, res, next) => {
  try {
    const { orderId, signature, paymentId, planId } = req.body;

    if (!orderId || !signature || !paymentId || !planId) {
      return res.status(400).json({
        message:
          "Missing required fields: orderId, signature, paymentId, planId",
      });
    }

    const sigCheck = verifyRazorpaySignature({ orderId, paymentId, signature });
    if (!sigCheck.ok) {
      return res.status(400).json({ message: sigCheck.reason || "Invalid payment signature" });
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const user = req.user;

    const existing = await Subscription.findOne({
      where: {
        userId: user.id,
        paymentId,
        platform: PAYMENT_PLATFORMS.RAZORPAY,
      },
    });

    if (existing) {
      return res.status(200).json({
        message: "Subscription already exists",
        data: existing,
      });
    }

    const startDate = new Date();
    const endDate = plan?.validUntil ? new Date(plan.validUntil) : null;

    if (!endDate || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Plan validUntil missing/invalid" });
    }

    if (endDate.getTime() <= Date.now()) {
      return res.status(400).json({ message: "This plan has expired. Please choose a different plan." });
    }

    const subscription = await Subscription.create({
      orderId,
      signature,
      paymentId,
      planId,
      userId: user.id,
      startDate,
      endDate,
      amount: Math.round(plan.amount + (plan.amount * plan.gstRate) / 100),
      paymentStatus: PAYMENT_STATUSES.SUCCESS,
      platform: PAYMENT_PLATFORMS.RAZORPAY,
    });

    sendPurchaseNotification({
      platform: PAYMENT_PLATFORMS.RAZORPAY,
      user,
      plan: plan?.toJSON ? plan.toJSON() : plan,
      subscription: subscription?.toJSON ? subscription.toJSON() : subscription,
      extra: { orderId, paymentId },
    }).catch(() => undefined);

    return res.status(201).json({
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
