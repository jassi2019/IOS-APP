const { Favorite, Topic, Chapter, Subject } = require("../../models");

const getV1 = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const docs = await Favorite.findAll({
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
            "chapterId",
            "subjectId",
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
      order: [["createdAt", "DESC"]],
    });

    if (!docs.length) {
      return res
        .status(200)
        .json({ message: "No favorites found.", data: null });
    }

    return res.status(200).json({
      message: "Favorites fetched successfully",
      data: docs,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = getV1;
