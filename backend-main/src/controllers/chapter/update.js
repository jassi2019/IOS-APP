const { Chapter } = require("../../models");

const updateV1 = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    const { name, description, number, subjectId, classId } = req.body;

    const doc = await Chapter.update(
      {
        name,
        description,
        number,
        subjectId,
        classId,
      },
      { where: { id: chapterId } }
    );

    return res
      .status(200)
      .json({ message: "Chapter updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
