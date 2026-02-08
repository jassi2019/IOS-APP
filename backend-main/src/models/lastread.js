const { DataTypes } = require("sequelize");

const db = require("../config/db");

const LastRead = db.define(
  "LastRead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    topicId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "topics",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "lastreads",
  }
);

LastRead.associate = (models) => {
  LastRead.belongsTo(models.Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
  });

  LastRead.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

module.exports = LastRead;
