const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "postgres",
  ...(env.NODE_ENV === "development"
    ? {}
    : {
        dialectOptions: {
          ssl: {
            require: false,
            rejectUnauthorized: false,
          },
        },
      }),
});

module.exports = sequelize;
