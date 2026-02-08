const { Op } = require("sequelize");
const { User, Subscription, Topic } = require("../../models");
const { PAYMENT_STATUSES, ROLES } = require("../../constants");

const getMonthlyData = async (model, options = {}) => {
  const currentYear = new Date().getFullYear();
  const monthlyData = [];

  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0);

    const count = await model.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        ...options.where,
      },
    });

    monthlyData.push({
      month: startDate.toLocaleString("default", { month: "short" }),
      value: count,
    });
  }

  return monthlyData;
};

const getRevenue = async () => {
  const currentYear = new Date().getFullYear();
  const monthlyData = [];

  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0);

    const totalAmount =
      (await Subscription.sum("amount", {
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          paymentStatus: PAYMENT_STATUSES.SUCCESS,
        },
      })) || 0;

    monthlyData.push({
      month: startDate.toLocaleString("default", { month: "short" }),
      value: totalAmount,
    });
  }

  return monthlyData;
};

const getDashboardStatsV1 = async (req, res, next) => {
  try {
    const totalUsers = await User.count({
      where: {
        role: ROLES.USER,
      },
    });

    const activeSubscriptions = await Subscription.count({
      where: {
        endDate: {
          [Op.gt]: new Date(),
        },
        paymentStatus: PAYMENT_STATUSES.SUCCESS,
      },
    });

    const totalTopics = await Topic.count();

    const totalRevenue =
      (await Subscription.sum("amount", {
        where: {
          paymentStatus: PAYMENT_STATUSES.SUCCESS,
        },
      })) || 0;

    const usersData = await getMonthlyData(User, {
      where: { role: ROLES.USER },
    });
    const subscriptionsData = await getMonthlyData(Subscription, {
      where: { paymentStatus: PAYMENT_STATUSES.SUCCESS },
    });
    const topicsData = await getMonthlyData(Topic);
    const revenueData = await getRevenue();

    const calculateGrowth = (data) => {
      const currentMonth = data[data.length - 1].value;
      const lastMonth = data[data.length - 2].value;
      if (lastMonth === 0 && currentMonth !== 0) return "+100%";
      if (lastMonth === 0 && currentMonth === 0) return "0%";
      return `${(((currentMonth - lastMonth) / lastMonth) * 100).toFixed(1)}%`;
    };

    const metrics = [
      {
        id: "users",
        title: "Students",
        total: totalUsers,
        description: "Registered students",
        trend: calculateGrowth(usersData),
        color: "#0ea5e9",
        data: usersData,
        icon: "Users",
      },
      {
        id: "subscriptions",
        title: "Active Subscriptions",
        total: activeSubscriptions,
        description: "Currently active users",
        trend: calculateGrowth(subscriptionsData),
        color: "#10b981",
        data: subscriptionsData,
        icon: "UserCheck",
      },
      {
        id: "revenue",
        title: "Revenue",
        total: totalRevenue,
        icon: "",
        description: "Total earnings",
        trend: calculateGrowth(revenueData),
        color: "#6366f1",
        data: revenueData,
        icon: "IndianRupee",
      },
      {
        id: "topics",
        title: "Topics",
        total: totalTopics,
        description: "Comprehensive coverage",
        trend: calculateGrowth(topicsData),
        color: "#f59e0b",
        data: topicsData,
        icon: "ListOrdered",
      },
    ];

    return res.json({
      message: "Dashboard stats fetched successfully",
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getDashboardStatsV1;
