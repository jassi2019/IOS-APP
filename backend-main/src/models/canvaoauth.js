const { DataTypes } = require("sequelize");

const db = require("../config/db");

const CanvaOauth = db.define(
  "CanvaOauth",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    codeVerifier: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    codeChallenge: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    redirectUri: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorizationUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiresIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tokenType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "canvaoauths",
  }
);

module.exports = CanvaOauth;
