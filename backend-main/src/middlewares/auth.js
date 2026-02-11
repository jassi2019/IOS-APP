const { User, Session } = require("../models");
const { verifyJWT } = require("../utils/jwt");
const { ROLES } = require("../constants");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyJWT(token);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    if (user.role === ROLES.ADMIN) {
      return next();
    }

    // Registration + password reset use short-lived OTP JWTs before session exists.
    const skipSessionCheckPaths = ["/register", "/reset/password"];
    if (!skipSessionCheckPaths.includes(req.path)) {
      const session = await Session.findOne({
        where: {
          userId: user.id,
          active: true,
        },
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.session = session;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
