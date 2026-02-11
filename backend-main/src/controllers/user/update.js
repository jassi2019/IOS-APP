const { User } = require("../../models");

const { hashPassword, comparePassword } = require("../../utils/bcrypt");

const updateV1 = async (req, res, next) => {
  try {
    let { userId } = req.params;
    const { name, currentPassword, password, bio, profilePicture } = req.body;

    if (userId.toLowerCase() === "me") {
      userId = req.user.id;
    }

    const doc = await User.findByPk(userId);
    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      doc.name = name;
    }

    if (bio !== undefined) {
      doc.bio = bio;
    }

    if (profilePicture !== undefined) {
      doc.profilePicture = profilePicture;
    }

    if (password) {
      const isPasswordCorrect = await comparePassword(
        currentPassword,
        doc.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      doc.password = await hashPassword(password);
    }

    await doc.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
