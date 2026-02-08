const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Plan = db.define(
  "Plan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gstRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
    },
    appleProductId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: "plans",
  }
);

Plan.associate = (models) => {
  Plan.hasMany(models.Subscription, {
    foreignKey: "planId",
    onDelete: "CASCADE",
  });
};

module.exports = Plan;
