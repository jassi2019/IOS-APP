const express = require("express");

const router = express.Router();

const getV1 = require("../../controllers/plan/get");

/**
 * @swagger
 * tags:
 *   name: Plan
 *   description: Plan related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         duration:
 *           type: number
 *         durationType:
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
 * /api/v1/plans:
 *   get:
 *     tags: [Plan]
 *     summary: Get all plans
 *     responses:
 *       200:
 *         description: Plans fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       404:
 *         description: No plans found
 *       500:
 *         description: Internal server error
 */

router.route("/").get(getV1);

module.exports = router;
