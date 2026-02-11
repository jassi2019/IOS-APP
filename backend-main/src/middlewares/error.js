const { logger } = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(err);

  if (err?.type === "entity.too.large" || err?.status === 413) {
    return res.status(413).json({
      message: "Request entity too large. Please upload a smaller image.",
    });
  }

  const statusCode = Number(err?.statusCode || err?.status || 500);
  return res.status(statusCode).json({ message: err?.message || "Internal server error" });
};
