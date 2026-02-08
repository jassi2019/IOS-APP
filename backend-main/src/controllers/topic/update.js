const { Topic } = require("../../models");
const { getDesign } = require("../../services/canva");

const updateV1 = async (req, res, next) => {
  try {
    const { topicId } = req.params;

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

    let contentThumbnail = undefined;

    if (contentId) {
      const {
        design: { thumbnail },
      } = await getDesign(contentId);

      contentThumbnail = thumbnail.url;
    }

    const doc = await Topic.update(
      {
        name,
        description,
        contentURL,
        contentThumbnail,
        contentId,
        sequence,
        serviceType,
        chapterId,
        subjectId,
        classId,
      },
      { where: { id: topicId } }
    );

    return res
      .status(200)
      .json({ message: "Topic updated successfully", data: doc });
  } catch (error) {
    next(error);
  }
};

module.exports = updateV1;
