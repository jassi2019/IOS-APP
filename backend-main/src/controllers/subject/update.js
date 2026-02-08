const { Subject } = require("../../models");

const updateV1 = async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { name, description } = req.body;

    const doc = await Subject.update(
      { name, description },
      { where: { id: subjectId } }
    );

    return res
      .status(200)
      .json({ message: "Subject updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
