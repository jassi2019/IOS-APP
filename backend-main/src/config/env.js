const dotenv = require("dotenv");
const path = require("path");

// Load env from backend-main/.env regardless of the current working directory.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ALLOW_DEV_OTP: process.env.ALLOW_DEV_OTP,
  APPLE_BUNDLE_ID: process.env.APPLE_BUNDLE_ID,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_SECURE: process.env.SMTP_SECURE,
  DEVELOPER_EMAILS: process.env.DEVELOPER_EMAILS,
  SWAGGER_HOST: process.env.SWAGGER_HOST,
  CANVA_AUTH_REDIRECT_URI: process.env.CANVA_AUTH_REDIRECT_URI,
  CANVA_CLIENT_ID: process.env.CANVA_CLIENT_ID,
  CANVA_CLIENT_SECRET: process.env.CANVA_CLIENT_SECRET,
  CANVA_AUTHORIZED_PERSON_EMAIL: process.env.CANVA_AUTHORIZED_PERSON_EMAIL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  APPLE_SHARED_SECRET: process.env.APPLE_SHARED_SECRET,
};
