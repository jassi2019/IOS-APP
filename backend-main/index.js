const express = require("express");
const cron = require("node-cron");
const cors = require("cors");
require("./src/config/env");
const db = require("./src/config/db");
const swaggerUI = require("swagger-ui-express");
const pinoHttp = require("pino-http");
const swaggerSpec = require("./swagger");
const routes = require("./src/routes");
const statsRoutes = require("./src/routes/stats");
const { logger } = require("./src/utils/logger");
const errorMiddleware = require("./src/middlewares/error");
const app = express();

const { renewDesignViewURL } = require("./src/services/canva");

const pinoLogger = pinoHttp({
  logger,
});

// Apple App Store receipts can be larger than the default 100kb body limit.
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cors());
app.use(pinoLogger);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health Check
 *     description: Returns a simple OK message to check if the server is running.
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/v1", routes);
app.use("/api/stats", statsRoutes);

app.use(errorMiddleware);

db.sync({ alter: true })
  .then(() => {
    // Listen on 0.0.0.0 to accept connections from any network interface (including mobile devices)
    app.listen(8000, '0.0.0.0', () => {
      logger.info(`Server is running on port 8000 and accessible from network`);
      logger.info(`Local: http://localhost:8000`);
      logger.info(`Network: http://192.168.1.4:8000`);
    });

    cron.schedule("0 */3 * * *", renewDesignViewURL);
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
