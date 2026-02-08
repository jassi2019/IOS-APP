const jwt = require("jsonwebtoken");

function generateJWT(payload, expiresIn = "180d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateJWT, verifyJWT };
