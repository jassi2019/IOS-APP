const { Topic, Subject, Chapter, Class } = require("../../models");
const { SERVICE_TYPES } = require("../../constants");

const getV1 = async (req, res, next) => {
  try {
    const query = {
      serviceType: SERVICE_TYPES.FREE,
    };

    const docs = await Topic.findAll({
      where: query,
      include: [
        {
          model: Chapter,
          attributes: ["id", "name", "number"],
          foreignKey: "chapterId",
          required: true,
        },
        {
          model: Subject,
          attributes: ["id", "name"],
          foreignKey: "subjectId",
          required: true,
        },
        {
          model: Class,
          attributes: ["id", "name"],
          foreignKey: "classId",
          required: true,
        },
      ],
    });

    return res
      .status(200)
      .json({ message: "Topics fetched successfully", data: docs });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
