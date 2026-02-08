const express = require("express");

const router = express.Router();

const { User } = require("../../models");

const getByIdV1 = require("../../controllers/user/get.by.id");
const updateV1 = require("../../controllers/user/update");

const authMiddleware = require("../../middlewares/auth");
const { isOwner } = require("../../middlewares/auth.z");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         profilePicture:
 *           type: string
 *         bio:
 *           type: string
 *         role:
 *           type: string
 *         registrationSource:
 *           type: string
 *         password:
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
 * /api/v1/users/{userId}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   put:
 *     tags: [User]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               password:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router
  .route("/:userId")
  .get(authMiddleware, isOwner(User), getByIdV1)
  .put(authMiddleware, isOwner(User), updateV1);

module.exports = router;
