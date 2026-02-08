const { Subscription } = require("../../models");
const { PAYMENT_STATUSES } = require("../../constants");

const razorpayWebhookV1 = async (req, res, next) => {
  const { event, payload } = req.body;

  console.log(JSON.stringify({event, payload}));

  if (event === "payment.captured") {
    const {
      payment: {
        entity: { order_id, method },
      },
    } = payload;

    const subscription = await Subscription.findOne({
      where: { orderId: order_id },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.paymentMethod = method;
    subscription.paymentStatus = PAYMENT_STATUSES.SUCCESS;

    await subscription.save();

    return res.status(200).json({ message: "Payment captured" });
  }

  if (event === "payment.failed") {
    const {
      payment: {
        entity: { order_id },
      },
    } = payload;

    const subscription = await Subscription.findOne({
      where: { orderId: order_id },
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.paymentStatus = PAYMENT_STATUSES.FAILED;
    await subscription.save();

    return res.status(200).json({ message: "Payment failed" });
  }
};

module.exports = razorpayWebhookV1;
