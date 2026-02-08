const express = require("express");

const router = express.Router();

const authorizeV1 = require("../../controllers/canva/authorize");
const getDesignsV1 = require("../../controllers/canva/get");

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");

/**
 * @swagger
 * /api/v1/canva/designs:
 *   get:
 *     summary: Retrieve designs
 *     description: Get a list of designs. Only accessible by admin users.
 *     tags:
 *       - Canva
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of designs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "design_id_123"
 *                   name:
 *                     type: string
 *                     example: "Design Name"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.route("/oauth/redirect").get(authorizeV1);
router.route("/designs").get(authMiddleware, isAdminRole, getDesignsV1);

module.exports = router;
