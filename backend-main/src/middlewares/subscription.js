const { Op } = require("sequelize");

const { Subscription, Topic } = require("../models");
const { SERVICE_TYPES, ROLES, PAYMENT_STATUSES } = require("../constants");

const isSubscribed = async (req, res, next) => {
  const user = req.user;
  const topicId = req.params.topicId;

  if (user.role === ROLES.ADMIN) {
    return next();
  }

  const topicDoc = await Topic.findByPk(topicId);

  if (topicDoc.serviceType === SERVICE_TYPES.FREE) {
    return next();
  }

  const subscriptionDoc = await Subscription.findOne({
    where: {
      userId: user.id,
      endDate: { [Op.gt]: new Date() },
      paymentStatus: PAYMENT_STATUSES.SUCCESS,
    },
  });

  if (!subscriptionDoc) {
    return res.status(400).json({ message: "User is not subscribed" });
  }

  next();
};

module.exports = isSubscribed;
