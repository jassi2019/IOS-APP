const { Subject } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const docs = await Subject.findAll({
      order: [["name", "ASC"]],
    });

    return res
      .status(200)
      .json({ message: "Subjects fetched successfully", data: docs });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
