const { User, Otp } = require("../../models");
const { generateOTP, generateOTPExpirationDate } = require("../../utils/otp");
const { OTP_TYPES } = require("../../constants");
const env = require("../../config/env");
const sendMail = require("../../services/mail");
const { normalizeEmailLower, whereEmailInsensitive } = require("../../utils/email");

const passwordResetEmailVerificationV1 = async (req, res, next) => {
  try {
    const { email } = req.body;
    const lowerCaseEmail = normalizeEmailLower(email);
    const allowDevOtp = String(env.ALLOW_DEV_OTP || "").toLowerCase() === "true";
    const genericSuccessMessage = "If an account exists for this email, an OTP has been sent.";

    if (!lowerCaseEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userDoc = await User.findOne({
      where: whereEmailInsensitive(lowerCaseEmail),
    });

    // Prevent user enumeration: respond with generic success even if user does not exist.
    if (!userDoc) {
      return res.status(200).json({ message: genericSuccessMessage, data: null });
    }

    // Keep a single active OTP per email/type.
    await Otp.destroy({
      where: { email: lowerCaseEmail, type: OTP_TYPES.PASSWORD_RESET },
    });

    const otpDoc = await Otp.create({
      email: lowerCaseEmail,
      otp: generateOTP(),
      expiresAt: generateOTPExpirationDate(),
      type: OTP_TYPES.PASSWORD_RESET,
    });

    try {
      await sendMail({
        to: lowerCaseEmail,
        subject: "OTP for password reset",
        viewFileName: "auth/password.reset.email.verification",
        content: {
          otp: otpDoc.otp,
        },
      });
    } catch (mailError) {
      if (allowDevOtp) {
        return res.status(200).json({
          message: genericSuccessMessage,
          data: { otp: otpDoc.otp },
        });
      }

      await otpDoc.destroy();
      return res.status(503).json({
        message: "Email service unavailable. Please try again in a moment.",
      });
    }

    return res.status(200).json({ message: genericSuccessMessage, data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = passwordResetEmailVerificationV1;
