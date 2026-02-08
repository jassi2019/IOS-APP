const express = require("express");

const router = express.Router();

const { Favorite } = require("../../models");

const createV1 = require("../../controllers/favorite/create");
const getV1 = require("../../controllers/favorite/get");
const deleteV1 = require("../../controllers/favorite/delete");

const authMiddleware = require("../../middlewares/auth");
const { isOwner } = require("../../middlewares/auth.z");

/**
 * @swagger
 * tags:
 *   name: Favorite
 *   description: Favorite related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
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
 * /api/v1/favorites:
 *   post:
 *     tags: [Favorite]
 *     summary: Create a new favorite
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
 *                 description: The ID of the topic to favorite
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Favorite already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/favorites:
 *   get:
 *     tags: [Favorite]
 *     summary: Get all favorites
 *     responses:
 *       200:
 *         description: Favorites fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       404:
 *         description: No favorites found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/favorites/{favoriteId}:
 *   delete:
 *     tags: [Favorite]
 *     summary: Delete a favorite
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the favorite to delete
 *     responses:
 *       200:
 *         description: Favorite deleted successfully
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Internal server error
 */

router.route("/").post(authMiddleware, createV1).get(authMiddleware, getV1);

router
  .route("/:favoriteId")
  .delete(authMiddleware, deleteV1);

module.exports = router;
