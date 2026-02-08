const { Plan } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const docs = await Plan.findAll({
      order: [["amount", "ASC"]],
    });

    return res
      .status(200)
      .json({ message: "Plans fetched successfully", data: docs });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
