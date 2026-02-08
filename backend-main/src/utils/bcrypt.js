const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const hashPasswordSync = (password) => {
  return bcrypt.hashSync(password, 10);
};

module.exports = { hashPassword, comparePassword, hashPasswordSync };
