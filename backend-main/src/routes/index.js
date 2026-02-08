const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const subjectRoutes = require("./subject");
const userRoutes = require("./user");
const classRoutes = require("./class");
const topicRoutes = require("./topic");
const favoriteRoutes = require("./favorite");
const canvaRoutes = require("./canva");
const chapterRoutes = require("./chapter");
const statsRoutes = require("./stats");
const planRoutes = require("./plan");
const logRoutes = require("./log");
const lastreadRoutes = require("./lastread");
const webhookRoutes = require("./webhook");
const subscriptionRoutes = require("./subscription");
const deletionRoutes = require("./deletion");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/subjects", subjectRoutes);
router.use("/classes", classRoutes);
router.use("/topics", topicRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/lastreads", lastreadRoutes);
router.use("/canva", canvaRoutes);
router.use("/chapters", chapterRoutes);
router.use("/stats", statsRoutes);
router.use("/plans", planRoutes);
router.use("/logs", logRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/deletions", deletionRoutes);

module.exports = router;
