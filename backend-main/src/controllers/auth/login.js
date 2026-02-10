const { User, Session } = require("../../models");
const { comparePassword } = require("../../utils/bcrypt");
const { generateJWT } = require("../../utils/jwt");
const { normalizeEmailLower, whereEmailInsensitive } = require("../../utils/email");

const loginV1 = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const lowercaseEmail = normalizeEmailLower(email);

    if (!lowercaseEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userDoc = await User.findOne({
      where: whereEmailInsensitive(lowercaseEmail),
    });

    if (!userDoc) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await comparePassword(password, userDoc.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateJWT({
      userId: userDoc.id,
    });

    await Session.update(
      {
        active: false,
      },
      {
        where: {
          userId: userDoc.id,
          active: true,
        },
      }
    );

    await Session.create({
      userId: userDoc.id,
      deviceName: req.headers["device-name"],
      deviceId: req.headers["device-id"],
      active: true,
    });

    return res.status(200).json({
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginV1;
