const { User, Otp } = require("../../models");
const { OTP_TYPES } = require("../../constants");
const { generateJWT } = require("../../utils/jwt");
const { whereEmailInsensitive } = require("../../utils/email");

const passwordResetOTPVerificationV1 = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();

    const otpDoc = await Otp.findOne({
      where: { email: normalizedEmail, otp, type: OTP_TYPES.PASSWORD_RESET },
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await otpDoc.destroy();

    const userDoc = await User.findOne({
      where: whereEmailInsensitive(normalizedEmail),
    });

    if (!userDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = generateJWT({ userId: userDoc.id });

    return res.status(200).json({
      message: "OTP verified successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = passwordResetOTPVerificationV1;
