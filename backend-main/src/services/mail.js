const nodemailer = require("nodemailer");
const env = require("../config/env");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

const sendMail = async ({
  to,
  subject,
  viewFileName,
  content,
  attachments = [],
}) => {
  const filePath = path.join(__dirname, `../views/${viewFileName}.handlebars`);
  const source = fs.readFileSync(filePath, "utf8").toString();
  const template = handlebars.compile(source);
  const replacements = { ...content };
  const html = template(replacements);

  const info = await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
    attachments,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
