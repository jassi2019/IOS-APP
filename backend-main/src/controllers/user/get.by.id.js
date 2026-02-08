const { Op } = require("sequelize");

const { User, Subscription, Plan } = require("../../models");
const { PAYMENT_STATUSES } = require("../../constants");

const getByIdV1 = async (req, res, next) => {
  try {
    let { userId } = req.params;

    if (userId.toLowerCase() === "me") {
      userId = req.user.id;
    }

    const subscription = await Subscription.findOne({
      where: {
        userId,
        endDate: { [Op.gte]: new Date() },
        paymentStatus: PAYMENT_STATUSES.SUCCESS,
      },
      include: {
        model: Plan,
        attributes: [
          "id",
          "name",
          "description",
          "amount",
          "gstRate",
          "validUntil",
        ],
      },
    });

    const doc = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      message: "User fetched successfully",
      data: {
        ...doc.dataValues,
        subscription: subscription ? subscription.dataValues : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getByIdV1;
