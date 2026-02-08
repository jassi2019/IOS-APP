const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/lastread/create");
const getV1 = require("../../controllers/lastread/get");

const authMiddleware = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Last Reads
 *   description: Last read related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LastRead:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         topicId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/lastreads:
 *   post:
 *     tags: [Last Reads]
 *     summary: Create a new last read
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicId
 *             properties:
 *               topicId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the topic to last read
 *     responses:
 *       201:
 *         description: Last read created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LastRead'
 *       400:
 *         description: Last read already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/lastreads:
 *   get:
 *     tags: [Last Reads]
 *     summary: Get last read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last read fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LastRead'
 *       404:
 *         description: No last read found
 *       500:
 *         description: Internal server error
 */

router.route("/").post(authMiddleware, createV1).get(authMiddleware, getV1);

module.exports = router;
