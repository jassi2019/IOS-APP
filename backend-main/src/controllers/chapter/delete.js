const { Chapter } = require("../../models");

const deleteV1 = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    await Chapter.destroy({ where: { id: chapterId } });

    return res
      .status(204)
      .send({ message: "Chapter deleted successfully.", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteV1;
