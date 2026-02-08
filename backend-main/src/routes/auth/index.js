const express = require("express");

const router = express.Router();

const registerV1 = require("../../controllers/auth/register");
const registrationEmailVerificationV1 = require("../../controllers/auth/registration.email.verification");
const registrationOTPVerificationV1 = require("../../controllers/auth/registration.otp.verification");
const loginV1 = require("../../controllers/auth/login");
const resetPasswordV1 = require("../../controllers/auth/reset.password");
const passwordResetEmailVerificationV1 = require("../../controllers/auth/password.reset.email.verification");
const passwordResetOTPVerificationV1 = require("../../controllers/auth/password.reset.otp.verification");

const authMiddleware = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: device-name
 *         description: Name of the device
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: device-id
 *         description: Unique identifier for the device
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/register/email/verification:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP for email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP sent to email
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/register/otp/verification:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP for registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP verified and user registered
 *       400:
 *         description: Invalid OTP or OTP expired
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     parameters:
 *       - in: header
 *         name: device-name
 *         description: Name of the device
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: device-id
 *         description: Unique identifier for the device
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 doc:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/reset/password:
 *   post:
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     summary: Reset password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Passwords do not match
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/reset/password/email/verification:
 *   post:
 *     tags: [Auth]
 *     summary: Send OTP for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Email not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/auth/reset/password/otp/verification:
 *   post:
 *     tags: [Auth]
 *     summary: Verify OTP for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or OTP expired
 *       500:
 *         description: Internal server error
 */

router.route("/register").post(authMiddleware, registerV1);
router
  .route("/register/email/verification")
  .post(registrationEmailVerificationV1);
router.route("/register/otp/verification").post(registrationOTPVerificationV1);
router.route("/login").post(loginV1);
router.route("/reset/password").post(authMiddleware, resetPasswordV1);
router
  .route("/reset/password/email/verification")
  .post(passwordResetEmailVerificationV1);
router
  .route("/reset/password/otp/verification")
  .post(passwordResetOTPVerificationV1);

module.exports = router;
