const { DataTypes } = require("sequelize");

const db = require("../config/db");

const Chapter = db.define(
  "Chapter",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "chapters",
  }
);

Chapter.associate = (models) => {
  Chapter.belongsTo(models.Class, {
    foreignKey: "classId",
    onDelete: "CASCADE",
  });

  Chapter.belongsTo(models.Subject, {
    foreignKey: "subjectId",
    onDelete: "CASCADE",
  });

  Chapter.hasMany(models.Topic, {
    foreignKey: "chapterId",
    onDelete: "CASCADE",
  });
};

module.exports = Chapter;
