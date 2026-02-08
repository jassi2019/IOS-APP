const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Favorite = db.define(
  "Favorite",
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
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "favorites",
  }
);

Favorite.associate = (models) => {
  Favorite.belongsTo(models.Topic, {
    foreignKey: "topicId",
    onDelete: "CASCADE",
  });

  Favorite.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

module.exports = Favorite;
