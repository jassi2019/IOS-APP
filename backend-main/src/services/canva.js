const { Op } = require("sequelize");
const axios = require("axios");
const { URLSearchParams } = require("url");
const { CanvaOauth, Topic } = require("../models");
const {
  CANVA_AUTH_REDIRECT_URI,
  CANVA_CLIENT_ID,
  CANVA_CLIENT_SECRET,
} = require("../config/env");

const renewAccessToken = async () => {
  try {
    const redirectUri = CANVA_AUTH_REDIRECT_URI;

    const canvaOauth = await CanvaOauth.findOne({
      where: {
        redirectUri,
      },
    });

    if (!canvaOauth) {
      throw new Error("Canva OAuth not found");
    }

    const { refreshToken } = canvaOauth;

    const credentials = Buffer.from(
      `${CANVA_CLIENT_ID}:${CANVA_CLIENT_SECRET}`
    ).toString("base64");

    const {
      data: {
        access_token,
        token_type,
        refresh_token: newRefreshToken,
        expires_in,
      },
    } = await axios.post(
      "https://api.canva.com/rest/v1/oauth/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: "design:content:read design:meta:read design:permission:read",
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    await CanvaOauth.update(
      {
        accessToken: access_token,
        tokenType: token_type,
        expiresIn: expires_in,
        refreshToken: newRefreshToken,
      },
      {
        where: {
          redirectUri,
        },
      }
    );

    return access_token;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to renew access token");
  }
};

async function getAccessToken() {
  const canvaOauth = await CanvaOauth.findOne({});

  if (!canvaOauth) {
    throw new Error("Canva OAuth not found");
  }

  const { accessToken, expiresIn, updatedAt } = canvaOauth;

  const expirationTimestamp = new Date(updatedAt).getTime() + expiresIn * 1000;

  if (Date.now() >= expirationTimestamp - 5 * 60 * 1000) {
    return await renewAccessToken();
  }

  return accessToken;
}

const getDesign = async (designId) => {
  const accessToken = await getAccessToken();

  const { data } = await axios.get(
    `https://api.canva.com/rest/v1/designs/${designId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return data;
};

const renewDesignViewURL = async () => {
  console.log("Renewing design view URLs");

  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const docs = await Topic.findAll({
      where: {
        contentId: {
          [Op.ne]: null,
        },
        updatedAt: {
          [Op.lt]: fiveMinutesAgo,
        },
      },
    });

    if (docs.length === 0) {
      return;
    }

    for (const doc of docs) {
      const { contentId } = doc;
      const {
        design: { thumbnail },
      } = await getDesign(contentId);

      await doc.update({
        contentThumbnail: thumbnail.url,
      });
    }

    console.log("All design view URLs renewed successfully");
  } catch (error) {
    console.error("Failed to renew design view URLs");
    console.error(error);
  }
};

module.exports = {
  getAccessToken,
  getDesign,
  renewDesignViewURL,
};
