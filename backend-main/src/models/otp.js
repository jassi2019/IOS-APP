const { DataTypes } = require("sequelize");

const db = require("../config/db");
const { OTP_TYPES } = require("../constants");

const Otp = db.define(
  "Otp",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(OTP_TYPES.REGISTRATION, OTP_TYPES.PASSWORD_RESET),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "otps",
  }
);

module.exports = Otp;
