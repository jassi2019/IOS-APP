const { LastRead, Topic, Subject, Chapter } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const doc = await LastRead.findOne({
      where: { userId },
      include: [
        {
          model: Topic,
          attributes: [
            "id",
            "name",
            "description",
            "contentURL",
            "contentThumbnail",
            "contentId",
            "sequence",
            "serviceType",
            "classId",
          ],
          include: [
            {
              model: Chapter,
              attributes: ["id", "name", "number"],
            },
            {
              model: Subject,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!doc) {
      return res
        .status(200)
        .json({ message: "Last read not found", data: null });
    }

    return res
      .status(200)
      .json({ message: "Last read fetched successfully", data: doc.Topic });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
