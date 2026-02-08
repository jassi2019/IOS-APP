const { ROLES } = require("../constants");

const isAdminRole = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "You are not authorized" });
  }
};

const isOwner = (model) => {
  return async (req, res, next) => {
    const user = req.user;

    const paramField = `${model.name.toLowerCase()}Id`;

    let id = null;

    if (req.params[paramField]) {
      id = req.params[paramField];
    } else if (req.body[paramField]) {
      id = req.body[paramField];
    }

    if (paramField === "userId" && id && id.toLowerCase() === "me") {
      id = user.id;
    }

    const item = await model.findByPk(id);

    if (
      paramField === "userId" &&
      req.params[paramField].toLowerCase() === "me"
    ) {
      if (item.id !== id) {
        return res.status(403).json({ message: "You are not authorized" });
      }
    }

    if (!item || (item.userId !== user.id && paramField !== "userId")) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    next();
  };
};

module.exports = { isAdminRole, isOwner };
