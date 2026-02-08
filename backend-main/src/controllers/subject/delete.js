const { Subject } = require("../../models");

const deleteV1 = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    await Subject.destroy({ where: { id: subjectId } });

    return res
      .status(204)
      .send({ message: "Subject deleted successfully", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteV1;
