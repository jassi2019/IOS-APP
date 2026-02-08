const { Chapter } = require("../../models");

const createV1 = async (req, res, next) => {
  try {
    const { name, description, number, subjectId, classId } = req.body;

    const doc = await Chapter.create({
      name,
      description,
      number,
      subjectId,
      classId,
    });

    return res
      .status(201)
      .json({ message: "Chapter created successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
