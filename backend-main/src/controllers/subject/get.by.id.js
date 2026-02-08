const { Subject } = require("../../models");

const getByIdV1 = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const doc = await Subject.findByPk(subjectId);

    return res
      .status(200)
      .json({ message: "Subject fetched successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = getByIdV1;
