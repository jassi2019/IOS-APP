const { Class } = require("../../models");

const updateV1 = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { name, description } = req.body;

    const doc = await Class.update(
      { name, description },
      { where: { id: classId } }
    );

    return res
      .status(200)
      .json({ message: "Class updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
