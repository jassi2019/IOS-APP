const { User, Otp } = require("../../models");
const { generateOTP, generateOTPExpirationDate } = require("../../utils/otp");
const { OTP_TYPES } = require("../../constants");
const env = require("../../config/env");
const sendMail = require("../../services/mail");

const canSendEmail = () =>
  !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM);

const allowDevOtp = () => String(env.ALLOW_DEV_OTP || "").toLowerCase() === "true";

const registrationEmailVerificationV1 = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const lowerCaseEmail = email.toLowerCase();

    const userDoc = await User.findOne({
      where: { email: lowerCaseEmail },
    });

    if (userDoc) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otpDoc = await Otp.create({
      email: lowerCaseEmail,
      otp: generateOTP(),
      expiresAt: generateOTPExpirationDate(),
      type: OTP_TYPES.REGISTRATION,
    });

    // If SMTP isn't configured (common in local dev), don't fail sign-up.
    // In dev mode, return the OTP so the mobile app can continue.
    if (!canSendEmail()) {
      if (allowDevOtp()) {
        return res.status(201).json({
          message: "OTP generated (dev)",
          data: { otp: otpDoc.otp, devOnly: true },
        });
      }

      return res.status(503).json({
        message:
          "Email service is not configured. Please set SMTP_* env vars or enable ALLOW_DEV_OTP=true for local testing.",
      });
    }

    try {
      await sendMail({
        to: lowerCaseEmail,
        subject: "OTP for registration",
        viewFileName: "auth/registration.email.verification",
        content: {
          otp: otpDoc.otp,
        },
      });
    } catch (e) {
      if (allowDevOtp()) {
        return res.status(201).json({
          message: "OTP generated (dev)",
          data: { otp: otpDoc.otp, devOnly: true },
        });
      }

      return res.status(503).json({
        message: "Unable to send OTP email. Please try again later.",
      });
    }

    return res.status(201).json({ message: "OTP sent to email", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = registrationEmailVerificationV1;
