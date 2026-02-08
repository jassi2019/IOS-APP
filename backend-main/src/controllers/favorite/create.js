const { Favorite } = require("../../models");

const createV1 = async (req, res, next) => {
  try {
    const { topicId } = req.body;

    const userId = req.user.id;

    const existingFavorite = await Favorite.findOne({
      where: { topicId, userId },
    });

    if (existingFavorite) {
      await Favorite.destroy({ where: { id: existingFavorite.id } });
    }

    const doc = await Favorite.create({ topicId, userId });

    return res
      .status(201)
      .json({ message: "Favorite created successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
