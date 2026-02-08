const { Subject } = require("../../models");

const createV1 = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const doc = await Subject.create({ name, description });
    return res
      .status(201)
      .json({ message: "Subject created successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
