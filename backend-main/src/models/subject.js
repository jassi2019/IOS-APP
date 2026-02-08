const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Subject = db.define(
  "Subject",
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
    tableName: "subjects",
  }
);

Subject.associate = (models) => {
  Subject.hasMany(models.Chapter, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
  });

  Subject.hasMany(models.Topic, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
  });
};

module.exports = Subject;
