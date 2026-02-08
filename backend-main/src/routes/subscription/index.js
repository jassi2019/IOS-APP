const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/subscription/create");
const createOrderV1 = require("../../controllers/subscription/create.order");
const createAppleIapV1 = require("../../controllers/subscription/create.apple.iap");
const authMiddleware = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         orderId:
 *           type: string
 *         paymentId:
 *           type: string
 *         amount:
 *           type: number
 *         paymentStatus:
 *           type: string
 *         platform:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     tags: [Subscription]
 *     summary: Create a subscription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The orderId of the subscription
 *               signature:
 *                 type: string
 *                 description: The signature of the subscription
 *               paymentId:
 *                 type: string
 *                 description: The paymentId of the subscription
 *               planId:
 *                 type: string
 *                 description: The planId of the subscription
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subscriptions/create-order:
 *   post:
 *     tags: [Subscription]
 *     summary: Create an order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 description: The planId of the subscription
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

router.route("/").post(authMiddleware, createV1);
router.route("/create-order").post(authMiddleware, createOrderV1);
router.route("/iap/apple").post(authMiddleware, createAppleIapV1);

module.exports = router;
