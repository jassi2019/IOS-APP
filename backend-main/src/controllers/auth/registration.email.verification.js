const { User, Otp } = require("../../models");
const { generateOTP, generateOTPExpirationDate } = require("../../utils/otp");
const { OTP_TYPES } = require("../../constants");
const sendMail = require("../../services/mail");

const registrationEmailVerificationV1 = async (req, res, next) => {
  try {
    const { email } = req.body;

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

    await sendMail({
      to: lowerCaseEmail,
      subject: "OTP for registration",
      viewFileName: "auth/registration.email.verification",
      content: {
        otp: otpDoc.otp,
      },
    });

    return res.status(201).json({ message: "OTP sent to email", data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = registrationEmailVerificationV1;
