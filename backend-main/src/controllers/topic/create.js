const { Topic } = require("../../models");
const { getDesign } = require("../../services/canva");

const createV1 = async (req, res, next) => {
  try {
    const {
      name,
      description,
      contentId,
      contentURL,
      sequence,
      serviceType,
      chapterId,
      subjectId,
      classId,
    } = req.body;

    const {
      design: { thumbnail },
    } = await getDesign(contentId);

    const doc = await Topic.create({
      name,
      description,
      contentURL,
      contentThumbnail: thumbnail.url,
      contentId,
      sequence,
      serviceType,
      chapterId,
      subjectId,
      classId,
    });

    return res
      .status(201)
      .json({ message: "Topic created successfully", data: doc });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = createV1;
