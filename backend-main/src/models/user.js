const { DataTypes } = require("sequelize");

const db = require("../config/db");
const { ROLES, REGISTRATION_SOURCES } = require("../constants");

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    profilePicture: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM(ROLES.ADMIN, ROLES.USER),
      allowNull: false,
      defaultValue: ROLES.USER,
    },
    registrationSource: {
      type: DataTypes.ENUM(
        REGISTRATION_SOURCES.APP,
        REGISTRATION_SOURCES.GOOGLE
      ),
      allowNull: false,
      defaultValue: REGISTRATION_SOURCES.APP,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

User.associate = (models) => {
  User.hasMany(models.Favorite, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Subscription, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Session, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasOne(models.Deletion, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

module.exports = User;
