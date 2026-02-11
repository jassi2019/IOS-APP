const nodemailer = require("nodemailer");
const env = require("../config/env");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

const hasMailConfig = () => {
  return !!(
    env.SMTP_HOST &&
    env.SMTP_PORT &&
    env.SMTP_USER &&
    env.SMTP_PASSWORD &&
    env.SMTP_FROM
  );
};

const getTimeoutMs = () => {
  const parsed = Number(env.SMTP_TIMEOUT_MS);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 10000;
};

const transporter = hasMailConfig()
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      connectionTimeout: getTimeoutMs(),
      greetingTimeout: getTimeoutMs(),
      socketTimeout: getTimeoutMs(),
    })
  : null;

const sendMail = async ({
  to,
  subject,
  viewFileName,
  content,
  attachments = [],
}) => {
  if (!transporter) {
    throw new Error("SMTP is not configured");
  }

  const filePath = path.join(__dirname, `../views/${viewFileName}.handlebars`);
  const source = fs.readFileSync(filePath, "utf8").toString();
  const template = handlebars.compile(source);
  const replacements = { ...content };
  const html = template(replacements);

  const mailPromise = transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
    attachments,
  });

  const timeoutMs = getTimeoutMs();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`SMTP request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  const info = await Promise.race([mailPromise, timeoutPromise]);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendMail;
