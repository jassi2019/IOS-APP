const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/deletion/create");

/**
 * @swagger
 * tags:
 *   name: Deletion
 *   description: Deletion related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Deletion:
 *       type: object
 *       properties:
 *         id:
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
 * /api/v1/deletions:
 *   post:
 *     tags: [Deletion]
 *     summary: Create a new deletion request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to delete
 *               password:
 *                 type: string
 *                 description: The password of the user to delete
 *     responses:
 *       201:
 *         description: Deletion request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Deletion request already exists
 *       500:
 *         description: Internal server error
 */

router.route("/request").post(createV1);

module.exports = router;
