const { DEVELOPER_EMAILS } = require("../../config/env");
const sendMail = require("../../services/mail");

const sendV1 = async (req, res, next) => {
  try {
    const { error } = req.body;

    const emails = DEVELOPER_EMAILS.split(",");

    await sendMail({
      to: emails,
      subject: "Application error",
      viewFileName: "error/error",
      content: { error, timestamp: new Date().toLocaleString() },
    });

    return res.status(200).send("OK");
  } catch (error) {
    next(error);
  }
};

module.exports = sendV1;
