const { Plan } = require("../../models");
const { createOrder } = require("../../services/razorpay");

const createV1 = async (req, res, next) => {
  try {
    const { planId } = req.body;

    const user = req.user;

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      res.status(404).json({ message: "Plan not found" });
      return;
    }

    const payableAmount = Math.round(
      plan.amount + (plan.amount * plan.gstRate) / 100
    );

    const order = await createOrder({
      userInfo: {
        name: user.name,
        email: user.email,
        userId: user.id,
        planId: plan.id,
      },
      price: payableAmount,
    });

    return res
      .status(200)
      .json({ message: "Order created successfully", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
