const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");
const getDashboardStatsV1 = require("../../controllers/stats/admin.dashboard");

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: API for retrieving statistics
 */

/**
 * @swagger
 * /api/v1/stats/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     description: Returns statistics for users, subscriptions, revenue, and topics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response with dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dashboard stats fetched successfully"
 *                 docs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "users"
 *                       title:
 *                         type: string
 *                         example: "Students"
 *                       total:
 *                         type: integer
 *                         example: 2834
 *                       description:
 *                         type: string
 *                         example: "Registered students"
 *                       trend:
 *                         type: string
 *                         example: "+12.5%"
 *                       color:
 *                         type: string
 *                         example: "#0ea5e9"
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             month:
 *                               type: string
 *                               example: "Jan"
 *                             value:
 *                               type: integer
 *                               example: 200
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router
  .route("/admin/dashboard")
  .get(authMiddleware, isAdminRole, getDashboardStatsV1);

module.exports = router;
