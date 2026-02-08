const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Class = db.define(
  "Class",
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
  },
  {
    timestamps: true,
    tableName: "classes",
  }
);

Class.associate = (models) => {
  Class.hasMany(models.Chapter, {
    foreignKey: "classId",
    onDelete: "CASCADE",
  });

  Class.hasMany(models.Topic, {
    foreignKey: "classId",
    onDelete: "CASCADE",
  });
};

module.exports = Class;
