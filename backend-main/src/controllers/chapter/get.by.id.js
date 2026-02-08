const { Chapter } = require("../../models");

const getByIdV1 = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    const doc = await Chapter.findByPk(chapterId);

    return res
      .status(200)
      .json({ message: "Chapter fetched successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = getByIdV1;
