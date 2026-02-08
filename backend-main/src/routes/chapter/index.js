const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/chapter/create");
const getV1 = require("../../controllers/chapter/get");
const getByIdV1 = require("../../controllers/chapter/get.by.id");
const updateV1 = require("../../controllers/chapter/update");
const deleteV1 = require("../../controllers/chapter/delete");

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");

/**
 * @swagger
 * tags:
 *   name: Chapter
 *   description: Chapter related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         subjectId:
 *           type: string
 *         classId:
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
 * /api/v1/chapters:
 *   post:
 *     tags: [Chapter]
 *     summary: Create a new chapter
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
 *               - description
 *               - subjectId
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the chapter
 *               description:
 *                 type: string
 *                 description: Detailed description of the chapter
 *               subjectId:
 *                 type: string
 *                 description: Subject ID of the chapter
 *               classId:
 *                 type: string
 *                 description: Class ID of the chapter
 *     responses:
 *       201:
 *         description: Chapter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       400:
 *         description: Chapter already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/chapters:
 *   get:
 *     tags: [Chapter]
 *     summary: Get all chapters
 *     responses:
 *       200:
 *         description: Chapters fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: No chapters found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/chapters/{chapterId}:
 *   get:
 *     tags: [Chapter]
 *     summary: Get a chapter by ID
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the chapter
 *     responses:
 *       200:
 *         description: Chapter fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/chapters/{chapterId}:
 *   put:
 *     tags: [Chapter]
 *     summary: Update a chapter
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the chapter to update
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
 *               subjectId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/chapters/{chapterId}:
 *   delete:
 *     tags: [Chapter]
 *     summary: Delete a chapter
 *     parameters:
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the chapter to delete
 *     responses:
 *       200:
 *         description: Chapter deleted successfully
 *       404:
 *         description: Chapter not found
 *       500:
 *         description: Internal server error
 */

router
  .route("/")
  .post(authMiddleware, isAdminRole, createV1)
  .get(authMiddleware, getV1);

router
  .route("/:chapterId")
  .get(authMiddleware, getByIdV1)
  .put(authMiddleware, isAdminRole, updateV1)
  .delete(authMiddleware, isAdminRole, deleteV1);

module.exports = router;
