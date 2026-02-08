const { User, Otp } = require("../../models");
const { OTP_TYPES } = require("../../constants");
const { hashPassword } = require("../../utils/bcrypt");
const { generateJWT } = require("../../utils/jwt");

const registrationOTPVerificationV1 = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({
      where: { email, otp, type: OTP_TYPES.REGISTRATION },
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await otpDoc.destroy();

    const userDoc = await User.create({
      email: email.toLowerCase(),
      name: email,
      password: await hashPassword(Math.random().toString(36).slice(-8)),
    });

    const token = generateJWT({ userId: userDoc.id });

    return res.status(201).json({
      message: "OTP sent to email",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registrationOTPVerificationV1;
