const express = require("express");

const router = express.Router();

const razorpayWebhookV1 = require("../../controllers/webhook/razorpay");

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Webhook related endpoints
 */

/**
 * @swagger
 * /api/v1/webhooks/razorpay:
 *   post:
 *     tags: [Webhook]
 *     summary: Handle Razorpay webhook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The event of the webhook
 *               payload:
 *                 type: object
 *                 description: The payload of the webhook containing payment details
 *                 properties:
 *                   payment:
 *                     type: object
 *                     description: The payment entity details
 *                     properties:
 *                       entity:
 *                         type: object
 *                         description: The details of the payment entity
 *                         properties:
 *                           order_id:
 *                             type: string
 *                             description: The unique identifier for the order
 *                           method:
 *                             type: string
 *                             description: The payment method used
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

router.route("/razorpay").post(razorpayWebhookV1);

module.exports = router;
