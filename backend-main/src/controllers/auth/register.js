const { User, Session } = require("../../models");
const { hashPassword } = require("../../utils/bcrypt");
const { generateJWT } = require("../../utils/jwt");

const registerV1 = async (req, res, next) => {
  try {
    const { password, name, profilePicture } = req.body;

    const user = req.user;

    const doc = await User.findOne({
      where: { id: user.id },
    });

    doc.set({
      name: name || doc.email.split("@")[0],
      password: await hashPassword(password),
      profilePicture,
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
      .json({ message: "Registration successful", data: { token } });
  } catch (error) {
    next(error);
  }
};

module.exports = registerV1;
