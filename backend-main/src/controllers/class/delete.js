const { Class } = require("../../models");

const deleteV1 = async (req, res, next) => {
  try {
    const { classId } = req.params;

    await Class.destroy({ where: { id: classId } });

    return res
      .status(204)
      .send({ message: "Class deleted successfully.", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteV1;
