const { Class } = require("../../models");

const getByIdV1 = async (req, res, next) => {
  try {
    const { classId } = req.params;

    const doc = await Class.findByPk(classId);

    return res
      .status(200)
      .json({ message: "Class fetched successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = getByIdV1;
