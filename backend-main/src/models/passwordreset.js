const { DataTypes } = require("sequelize");

const db = require("../config/db");

const PasswordReset = db.define(
  "PasswordReset",
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
  },
  {
    timestamps: true,
  }
);

PasswordReset.associate = (models) => {
  PasswordReset.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = PasswordReset;
