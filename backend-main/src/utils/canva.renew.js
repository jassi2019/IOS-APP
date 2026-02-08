const { renewDesignViewURL } = require("../services/canva");

const renewDesignViewURLV1 = async () => {
  try {
    await renewDesignViewURL();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(0);
  }
};

renewDesignViewURLV1();
