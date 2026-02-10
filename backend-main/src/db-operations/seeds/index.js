const { User, Plan } = require("../../models");
const USERS = require("./users");
const PLANS = require("./plans");

const { logger } = require("../../utils/logger");

const seedUsers = async () => {
  for (const user of USERS) {
    if (!user?.email) continue;

    // Idempotent seed: do not error if user already exists.
    const [existing, created] = await User.findOrCreate({
      where: { email: user.email },
      defaults: user,
    });

    // Keep existing passwords unchanged; only sync safe fields.
    if (!created) {
      await existing.update(
        {
          name: user.name,
          role: user.role,
          registrationSource: user.registrationSource,
        },
        {
          fields: ["name", "role", "registrationSource"],
        }
      );
    }
  }

  logger.info("Users seeded (idempotent)");
};

const seedPlans = async () => {
  for (const plan of PLANS) {
    if (!plan?.name) continue;

    // Idempotent seed: do not error if plan already exists.
    const [existing, created] = await Plan.findOrCreate({
      where: { name: plan.name },
      defaults: plan,
    });

    // Keep plans in sync with seed values.
    if (!created) {
      await existing.update(plan);
    }
  }

  logger.info("Plans seeded (idempotent)");
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
