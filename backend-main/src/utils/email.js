const { Sequelize } = require("sequelize");

const normalizeEmail = (value) => String(value || "").trim();

const normalizeEmailLower = (value) => normalizeEmail(value).toLowerCase();

// Case-insensitive match to avoid breaking existing users whose emails may not be stored in lowercase.
const whereEmailInsensitive = (value) =>
  Sequelize.where(
    Sequelize.fn("lower", Sequelize.col("email")),
    normalizeEmailLower(value)
  );

module.exports = {
  normalizeEmail,
  normalizeEmailLower,
  whereEmailInsensitive,
};

