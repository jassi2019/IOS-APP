const Deletion = require("./deletion");
const User = require("./user");
const Otp = require("./otp");
const Favorite = require("./favorite");
const Chapter = require("./chapter");
const Topic = require("./topic");
const Session = require("./session");
const Subscription = require("./subscription");
const LastRead = require("./lastread");
const Class = require("./class");
const Subject = require("./subject");
const CanvaOauth = require("./canvaoauth");
const Plan = require("./plan");

const models = {
  Deletion,
  User,
  Otp,
  Favorite,
  LastRead,
  Chapter,
  Topic,
  Session,
  Subscription,
  Class,
  Subject,
  CanvaOauth,
  Plan,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
