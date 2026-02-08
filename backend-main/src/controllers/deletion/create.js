const { Deletion, User } = require("../../models");
const { comparePassword } = require("../../utils/bcrypt");

const createV1 = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userDoc = await User.findOne({
      where: { email },
    });

    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, userDoc.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userId = userDoc.id;

    const existingDeletion = await Deletion.findOne({ where: { userId } });

    if (existingDeletion) {
      return res
        .status(400)
        .json({ message: "Deletion request already exists" });
    }

    await Deletion.create({ userId });

    return res
      .status(201)
      .json({ message: "Deletion request created successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = createV1;
