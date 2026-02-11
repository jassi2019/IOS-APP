const { User, Session } = require("../../models");
const { hashPassword } = require("../../utils/bcrypt");
const { generateJWT } = require("../../utils/jwt");

const resetPasswordV1 = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;

    const user = req.user;

    const doc = await User.findOne({
      where: { id: user.id },
    });

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    doc.set({
      password: await hashPassword(password),
    });

    await doc.save();

    const token = generateJWT({ userId: doc.id });

    const deviceName =
      req.headers["device-name"] || req.body?.deviceName || "unknown-device";
    const deviceId =
      req.headers["device-id"] || req.body?.deviceId || "unknown-device-id";

    await Session.create({
      userId: doc.id,
      deviceName,
      deviceId,
      active: true,
    });

    return res
      .status(200)
      .json({ message: "Password reset successful", data: { token } });
  } catch (error) {
    next(error);
  }
};

module.exports = resetPasswordV1;
