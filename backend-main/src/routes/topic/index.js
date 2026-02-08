const express = require("express");

const router = express.Router();

const createV1 = require("../../controllers/topic/create");
const getV1 = require("../../controllers/topic/get");
const getByIdV1 = require("../../controllers/topic/get.by.id");
const updateV1 = require("../../controllers/topic/update");
const deleteV1 = require("../../controllers/topic/delete");
const getFreeV1 = require("../../controllers/topic/get.free");

const authMiddleware = require("../../middlewares/auth");
const { isAdminRole } = require("../../middlewares/auth.z");
const isSubscribed = require("../../middlewares/subscription");

/**
 * @swagger
 * tags:
 *   name: Topic
 *   description: Topic related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         contentURL:
 *           type: string
 *         sequence:
 *           type: number
 *         serviceType:
 *           type: string
 *         chapterId:
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
 * /api/v1/topics:
 *   post:
 *     tags: [Topic]
 *     summary: Create a new topic
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
 *               - contentURL
 *               - sequence
 *               - serviceType
 *               - chapterId
 *               - subjectId
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the topic
 *               description:
 *                 type: string
 *                 description: Detailed description of the topic
 *               contentURL:
 *                 type: string
 *                 description: URL of the content
 *               sequence:
 *                 type: number
 *                 description: Sequence of the topic
 *               serviceType:
 *                 type: string
 *                 description: Service type of the topic
 *               chapterId:
 *                 type: string
 *                 description: Chapter ID of the topic
 *               subjectId:
 *                 type: string
 *                 description: Subject ID of the topic
 *               classId:
 *                 type: string
 *                 description: Class ID of the topic
 *     responses:
 *       201:
 *         description: Topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Topic already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/topics:
 *   get:
 *     tags: [Topic]
 *     summary: Get all topics
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *       - in: query
 *         name: classId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       404:
 *         description: No topics found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/topics/free:
 *   get:
 *     tags: [Topic]
 *     summary: Get all free topics
 *     responses:
 *       200:
 *         description: Topics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *       404:
 *         description: No topics found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/topics/{topicId}:
 *   get:
 *     tags: [Topic]
 *     summary: Get a topic by ID
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the topic
 *     responses:
 *       200:
 *         description: Topic fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/topics/{topicId}:
 *   put:
 *     tags: [Topic]
 *     summary: Update a topic
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the topic to update
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
 *               contentURL:
 *                 type: string
 *               sequence:
 *                 type: number
 *               serviceType:
 *                 type: string
 *               chapterId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/topics/{topicId}:
 *   delete:
 *     tags: [Topic]
 *     summary: Delete a topic
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the topic to delete
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */

router
  .route("/")
  .post(authMiddleware, isAdminRole, createV1)
  .get(authMiddleware, getV1);

router.route("/free").get(authMiddleware, getFreeV1);

router
  .route("/:topicId")
  .get(authMiddleware, isSubscribed, getByIdV1)
  .put(authMiddleware, isAdminRole, updateV1)
  .delete(authMiddleware, isAdminRole, deleteV1);

module.exports = router;
