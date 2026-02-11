const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

require("../../config/env");
const db = require("../../config/db");
const { Class, Subject, Chapter, Topic } = require("../../models");
const { SERVICE_TYPES } = require("../../constants");
const { logger } = require("../../utils/logger");

const SOURCE_CANDIDATES = [
  // Workspace source (when backend and app are in same parent folder)
  path.resolve(__dirname, "../../../../src/constants/guestData.json"),
  // Snapshot source committed inside backend
  path.resolve(__dirname, "./guestData.snapshot.json"),
];

const loadGuestData = () => {
  for (const candidate of SOURCE_CANDIDATES) {
    if (!fs.existsSync(candidate)) continue;
    const raw = fs.readFileSync(candidate, "utf8");
    const parsed = JSON.parse(raw);
    logger.info({ source: candidate }, "Loaded guest content source");
    return parsed;
  }

  throw new Error(
    `No guest content source found. Checked: ${SOURCE_CANDIDATES.join(", ")}`
  );
};

const normalizeText = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const asDate = (value) => {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

const deterministicUuid = (seed) => {
  const hex = crypto.createHash("sha1").update(String(seed)).digest("hex").slice(0, 32).split("");
  hex[12] = "4";
  hex[16] = "a";
  return `${hex.slice(0, 8).join("")}-${hex.slice(8, 12).join("")}-${hex
    .slice(12, 16)
    .join("")}-${hex.slice(16, 20).join("")}-${hex.slice(20, 32).join("")}`;
};

const seedContent = async () => {
  const payload = loadGuestData();

  const classes = (payload.classes || [])
    .filter((row) => row?.id && row?.name)
    .map((row) => ({
      id: row.id,
      name: row.name.trim(),
      description: normalizeText(row.description),
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    }));

  const subjects = (payload.subjects || [])
    .filter((row) => row?.id && row?.name)
    .map((row) => ({
      id: row.id,
      name: row.name.trim(),
      description: normalizeText(row.description),
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    }));

  const classIds = new Set(classes.map((row) => row.id));
  const subjectIds = new Set(subjects.map((row) => row.id));

  const chapters = (payload.chapters || [])
    .filter(
      (row) =>
        row?.id &&
        row?.name &&
        row?.classId &&
        row?.subjectId &&
        classIds.has(row.classId) &&
        subjectIds.has(row.subjectId)
    )
    .map((row) => ({
      id: row.id,
      number: Number.isInteger(row.number) ? row.number : 1,
      name: row.name.trim(),
      description: normalizeText(row.description),
      classId: row.classId,
      subjectId: row.subjectId,
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    }));

  const chapterIds = new Set(chapters.map((row) => row.id));

  const freeTopics = (payload.freeTopics || [])
    .filter(
      (row) =>
        row?.id &&
        row?.name &&
        row?.description &&
        row?.contentURL &&
        row?.contentThumbnail &&
        row?.contentId &&
        row?.chapterId &&
        row?.subjectId &&
        row?.classId &&
        chapterIds.has(row.chapterId) &&
        subjectIds.has(row.subjectId) &&
        classIds.has(row.classId)
    )
    .map((row, idx) => ({
      id: row.id,
      name: row.name.trim(),
      description: row.description,
      contentURL: row.contentURL,
      contentThumbnail: row.contentThumbnail,
      contentId: String(row.contentId),
      sequence: Number.isFinite(Number(row.sequence)) ? Number(row.sequence) : idx + 1,
      serviceType:
        row.serviceType === SERVICE_TYPES.PREMIUM
          ? SERVICE_TYPES.PREMIUM
          : SERVICE_TYPES.FREE,
      chapterId: row.chapterId,
      subjectId: row.subjectId,
      classId: row.classId,
      createdAt: asDate(row.createdAt),
      updatedAt: asDate(row.updatedAt),
    }));

  const freeTopicBySubject = new Map();
  for (const topic of freeTopics) {
    if (!freeTopicBySubject.has(topic.subjectId)) {
      freeTopicBySubject.set(topic.subjectId, topic);
    }
  }

  const premiumFromFreeTopics = freeTopics.map((topic) => ({
    ...topic,
    id: deterministicUuid(`premium-copy:${topic.id}`),
    name: `${topic.name} (Premium)`,
    serviceType: SERVICE_TYPES.PREMIUM,
    sequence: topic.sequence + 1000,
    // Keep a valid Canva design ID so background thumbnail refresh keeps working.
    contentId: topic.contentId,
    updatedAt: new Date(),
  }));

  const chaptersWithTopic = new Set(freeTopics.map((topic) => topic.chapterId));
  const chapterFallbackPremiumTopics = chapters
    .filter((chapter) => !chaptersWithTopic.has(chapter.id))
    .map((chapter, idx) => {
      const fallback = freeTopicBySubject.get(chapter.subjectId) || freeTopics[0] || null;

      return {
        id: deterministicUuid(`premium-chapter:${chapter.id}`),
        name: `${chapter.name} (Premium)`,
        description:
          chapter.description || "Premium lesson for this chapter is available to subscribed users.",
        contentURL: fallback?.contentURL || "https://www.canva.com/",
        contentThumbnail:
          fallback?.contentThumbnail ||
          "https://dummyimage.com/1200x630/e5e7eb/111827&text=Premium+Topic",
        // Reuse a real design ID to avoid renewal failures.
        contentId: fallback?.contentId || "fallback_design_id",
        sequence: 5000 + (chapter.number || 0),
        serviceType: SERVICE_TYPES.PREMIUM,
        chapterId: chapter.id,
        subjectId: chapter.subjectId,
        classId: chapter.classId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

  const allTopics = [
    ...freeTopics,
    ...premiumFromFreeTopics,
    ...chapterFallbackPremiumTopics,
  ];

  logger.info(
    {
      classes: classes.length,
      subjects: subjects.length,
      chapters: chapters.length,
      freeTopics: freeTopics.length,
      premiumTopics: premiumFromFreeTopics.length + chapterFallbackPremiumTopics.length,
      totalTopics: allTopics.length,
    },
    "Prepared content payload for seed"
  );

  await db.authenticate();

  const transaction = await db.transaction();
  try {
    if (classes.length) {
      await Class.bulkCreate(classes, {
        updateOnDuplicate: ["name", "description", "updatedAt"],
        transaction,
      });
    }

    if (subjects.length) {
      await Subject.bulkCreate(subjects, {
        updateOnDuplicate: ["name", "description", "updatedAt"],
        transaction,
      });
    }

    if (chapters.length) {
      await Chapter.bulkCreate(chapters, {
        updateOnDuplicate: [
          "number",
          "name",
          "description",
          "classId",
          "subjectId",
          "updatedAt",
        ],
        transaction,
      });
    }

    if (allTopics.length) {
      await Topic.bulkCreate(allTopics, {
        updateOnDuplicate: [
          "name",
          "description",
          "contentURL",
          "contentThumbnail",
          "contentId",
          "sequence",
          "serviceType",
          "chapterId",
          "subjectId",
          "classId",
          "updatedAt",
        ],
        transaction,
      });
    }

    await transaction.commit();
    logger.info("Content seed completed");
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    logger.error({ err: error }, "Content seed failed");
    process.exit(1);
  }
};

seedContent();
