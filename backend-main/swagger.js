const { SWAGGER_HOST } = require("./src/config/env");

const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tyari NEET ki",
    version: "1.0.0",
    description: "Tyari NEET ki API",
  },
  servers: [
    {
      url: `${SWAGGER_HOST}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.js", "./index.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
