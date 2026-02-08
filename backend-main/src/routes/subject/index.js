const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/subject/create");
const getV1 = require("../../controllers/subject/get");
const getByIdV1 = require("../../controllers/subject/get.by.id");
const updateV1 = require("../../controllers/subject/update");
const deleteV1 = require("../../controllers/subject/delete");

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");

/**
 * @swagger
 * tags:
 *   name: Subject
 *   description: Subject related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
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
 * /api/v1/subjects:
 *   post:
 *     tags: [Subject]
 *     summary: Create a new subject
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
 *                 description: Name of the subject
 *               description:
 *                 type: string
 *                 description: Detailed description of the subject
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Subject already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subjects:
 *   get:
 *     tags: [Subject]
 *     summary: Get all subjects
 *     responses:
 *       200:
 *         description: Subjects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       404:
 *         description: No subjects found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subjects/{subjectId}:
 *   get:
 *     tags: [Subject]
 *     summary: Get a subject by ID
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the subject
 *     responses:
 *       200:
 *         description: Subject fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subjects/{subjectId}:
 *   put:
 *     tags: [Subject]
 *     summary: Update a subject
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the subject to update
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
 *         description: Subject updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/subjects/{subjectId}:
 *   delete:
 *     tags: [Subject]
 *     summary: Delete a subject
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the subject to delete
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */

router
  .route("/")
  .post(authMiddleware, isAdminRole, createV1)
  .get(authMiddleware, getV1);

router
  .route("/:subjectId")
  .get(authMiddleware, getByIdV1)
  .put(authMiddleware, isAdminRole, updateV1)
  .delete(authMiddleware, isAdminRole, deleteV1);

module.exports = router;
