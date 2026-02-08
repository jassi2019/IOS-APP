const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Session = db.define(
  "Session",
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "sessions",
  }
);

Session.associate = (models) => {
  Session.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = Session;
