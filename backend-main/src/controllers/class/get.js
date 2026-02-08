const { Class } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const docs = await Class.findAll({
      order: [["name", "ASC"]],
    });

    return res
      .status(200)
      .json({ message: "Classes fetched successfully", data: docs });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
