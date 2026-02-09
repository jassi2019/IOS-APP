const { Plan } = require("../../models");
const { getPlanAppleProductId } = require("../../utils/appleIap");

const getV1 = async (req, res, next) => {
  try {
    const docs = await Plan.findAll({
      order: [["amount", "ASC"]],
    });

    return res
      .status(200)
      .json({
        message: "Plans fetched successfully",
        data: docs.map((doc) => {
          const json = doc.toJSON ? doc.toJSON() : doc;
          const appleProductId = getPlanAppleProductId(doc) || null;
          return {
            ...json,
            appleProductId,
          };
        }),
      });
  } catch (error) {
    next(error);
  }
};

module.exports = getV1;
