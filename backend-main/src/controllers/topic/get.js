const { Topic, Subject, Chapter, Class } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const { subjectId, classId, chapterId } = req.query;

    const query = {};

    if (subjectId) {
      query.subjectId = subjectId;
    }

    if (classId) {
      query.classId = classId;
    }

    if (chapterId) {
      query.chapterId = chapterId;
    }

    const docs = await Topic.findAll({
      where: query,
      order: [
        ["serviceType", "DESC"],
        ["sequence", "ASC"],
      ],
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
