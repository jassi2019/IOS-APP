const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Deletion = db.define(
  "Deletion",
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
    tableName: "deletions",
  }
);

Deletion.associate = (models) => {
  Deletion.hasOne(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

module.exports = Deletion;
