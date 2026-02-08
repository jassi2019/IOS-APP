const { User, Session } = require("../../models");
const { comparePassword } = require("../../utils/bcrypt");
const { generateJWT } = require("../../utils/jwt");

const loginV1 = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const lowercaseEmail = email.toLowerCase();

    const userDoc = await User.findOne({
      where: { email: lowercaseEmail },
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
