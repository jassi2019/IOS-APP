const { hashPasswordSync } = require("../../utils/bcrypt");
const { ROLES, REGISTRATION_SOURCES } = require("../../constants");

const USERS = [
  {
    name: "admin",
    email: "admin@example.com",
    password: hashPasswordSync("password"),
    role: ROLES.ADMIN,
    registrationSource: REGISTRATION_SOURCES.APP,
  },
];

module.exports = USERS;
