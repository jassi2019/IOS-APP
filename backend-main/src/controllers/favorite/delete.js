const { Favorite } = require("../../models");

const deleteV1 = async (req, res, next) => {
  try {
    const { favoriteId } = req.params;

    await Favorite.destroy({ where: { id: favoriteId } });

    return res
      .status(204)
      .send({ message: "Favorite removed successfully", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteV1;
