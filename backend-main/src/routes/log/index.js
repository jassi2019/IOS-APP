const express = require("express");

const router = express.Router();

const sendV1 = require("../../controllers/log/send");

/**
 * @swagger
 * tags:
 *   name: Log
 *   description: Log related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         error:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/logs/send:
 *   post:
 *     tags: [Log]
 *     summary: Send an error log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 description: The error message
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */

router.route("/send").post(sendV1);

module.exports = router;
