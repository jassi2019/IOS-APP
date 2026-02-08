const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/class/create");
const getV1 = require("../../controllers/class/get");
const getByIdV1 = require("../../controllers/class/get.by.id");
const updateV1 = require("../../controllers/class/update");
const deleteV1 = require("../../controllers/class/delete");

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");
/**
 * @swagger
 * tags:
 *   name: Class
 *   description: Class related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
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
 * /api/v1/classes:
 *   post:
 *     tags: [Class]
 *     summary: Create a new class
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the class
 *               description:
 *                 type: string
 *                 description: Detailed description of the class
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Class already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/classes:
 *   get:
 *     tags: [Class]
 *     summary: Get all classes
 *     responses:
 *       200:
 *         description: Classes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       404:
 *         description: No classes found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/classes/{classId}:
 *   get:
 *     tags: [Class]
 *     summary: Get a class by ID
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the class
 *     responses:
 *       200:
 *         description: Class fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/classes/{classId}:
 *   put:
 *     tags: [Class]
 *     summary: Update a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the class to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/classes/{classId}:
 *   delete:
 *     tags: [Class]
 *     summary: Delete a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the class to delete
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */

router
  .route("/")
  .post(authMiddleware, isAdminRole, createV1)
  .get(authMiddleware, getV1);

router
  .route("/:classId")
  .get(authMiddleware, getByIdV1)
  .put(authMiddleware, isAdminRole, updateV1)
  .delete(authMiddleware, isAdminRole, deleteV1);

module.exports = router;
