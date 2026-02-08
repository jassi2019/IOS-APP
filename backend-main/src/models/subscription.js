const { DataTypes } = require("sequelize");

const db = require("../config/db");
const { PAYMENT_STATUSES, PAYMENT_PLATFORMS } = require("../constants");

const Subscription = db.define(
  "Subscription",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "plans",
        key: "id",
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        PAYMENT_STATUSES.PENDING,
        PAYMENT_STATUSES.SUCCESS,
        PAYMENT_STATUSES.FAILED
      ),
      allowNull: false,
      defaultValue: PAYMENT_STATUSES.PENDING,
    },
    platform: {
      type: DataTypes.ENUM(
        PAYMENT_PLATFORMS.RAZORPAY,
        PAYMENT_PLATFORMS.APPLE_IAP,
        PAYMENT_PLATFORMS.STRIPE,
        PAYMENT_PLATFORMS.CASHFREE
      ),
      allowNull: false,
      defaultValue: PAYMENT_PLATFORMS.RAZORPAY,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "subscriptions",
  }
);

Subscription.associate = (models) => {
  Subscription.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Subscription.belongsTo(models.Plan, {
    foreignKey: "planId",
    onDelete: "CASCADE",
  });
};

module.exports = Subscription;
