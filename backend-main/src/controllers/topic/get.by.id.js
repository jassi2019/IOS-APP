const { Topic } = require("../../models");

const getByIdV1 = async (req, res, next) => {
  try {
    const { topicId } = req.params;

    const doc = await Topic.findByPk(topicId);

    return res
      .status(200)
      .json({ message: "Topic fetched successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = getByIdV1;
