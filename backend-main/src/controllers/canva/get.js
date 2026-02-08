const axios = require("axios");
const { CanvaOauth } = require("../../models");
const { getAccessToken } = require("../../services/canva");

const getDesignsV1 = async (req, res, next) => {
  try {
    const { query } = req.query;

    const redirectUri = process.env.CANVA_AUTH_REDIRECT_URI;

    const canvaOauth = await CanvaOauth.findOne({
      where: {
        redirectUri,
      },
    });

    if (!canvaOauth) {
      return res.status(404).json({ message: "Canva OAuth not found" });
    }

    const accessToken = await getAccessToken();

    const {
      data: { items: designs },
    } = await axios.get(
      `https://api.canva.com/rest/v1/designs?ownerships=owned&query=${
        query || ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.json({
      message: "Canva designs fetched successfully",
      data: designs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getDesignsV1;
