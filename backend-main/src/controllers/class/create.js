const { Class } = require("../../models");

const createV1 = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const doc = await Class.create({ name, description });
    return res
      .status(201)
      .json({ message: "Class created successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
