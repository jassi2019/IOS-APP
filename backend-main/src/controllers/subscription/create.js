const { Subscription, Plan } = require("../../models");
const { PAYMENT_PLATFORMS, PAYMENT_STATUSES } = require("../../constants");

const createV1 = async (req, res, next) => {
  try {
    const { orderId, signature, paymentId, planId } = req.body;

    if (!orderId || !signature || !paymentId || !planId) {
      return res.status(400).json({
        message:
          "Missing required fields: orderId, signature, paymentId, planId",
      });
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const user = req.user;

    const startDate = new Date();
    const endDate = plan.dataValues.validUntil;

    const subscription = await Subscription.create({
      orderId,
      signature,
      paymentId,
      planId,
      userId: user.id,
      startDate,
      endDate,
      amount: Math.round(plan.amount + (plan.amount * plan.gstRate) / 100),
      paymentStatus: PAYMENT_STATUSES.PENDING,
      platform: PAYMENT_PLATFORMS.RAZORPAY,
    });

    return res.status(201).json({
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
