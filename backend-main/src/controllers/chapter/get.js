const { Chapter } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const { classId, subjectId } = req.query;

    const where = {};

    if (classId) {
      where.classId = classId;
    }

    if (subjectId) {
      where.subjectId = subjectId;
    }

    const docs = await Chapter.findAll({
      where,
      order: [["number", "ASC"]],
    });

    return res
      .status(200)
      .json({ message: "Chapters fetched successfully", data: docs });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
