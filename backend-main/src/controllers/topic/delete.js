const { Topic } = require("../../models");

const deleteV1 = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    await Topic.destroy({ where: { id: topicId } });

    return res
      .status(204)
      .send({ message: "Topic deleted successfully", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteV1;
