const { User, Plan } = require("../../models");
const USERS = require("./users");
const PLANS = require("./plans");

const { logger } = require("../../utils/logger");

const seedUsers = async () => {
  await User.bulkCreate(USERS);
  logger.info("Users seeded");
};

const seedPlans = async () => {
  await Plan.bulkCreate(PLANS);
  logger.info("Plans seeded");
};

async function seed() {
  logger.info("Seeding...");
  try {
    await seedUsers();
    await seedPlans();
  } catch (error) {
    logger.error(error);
  } finally {
    logger.info("Seeding completed");
    process.exit(0);
  }
}

seed();
