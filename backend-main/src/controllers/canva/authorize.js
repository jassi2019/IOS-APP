const axios = require("axios");
const { URLSearchParams } = require("url");
const { CanvaOauth } = require("../../models");
const path = require("path");

const authorizeV1 = async (req, res, next) => {
  try {
    const { code } = req.query;

    const redirectUri = process.env.CANVA_AUTH_REDIRECT_URI;

    const canvaOauth = await CanvaOauth.findOne({
      where: {
        redirectUri,
      },
    });

    if (!canvaOauth) {
      return res.status(404).json({ message: "Canva OAuth not found" });
    }

    const { codeVerifier } = canvaOauth;

    const credentials = Buffer.from(
      `${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`
    ).toString("base64");

    const {
      data: { access_token, refresh_token, token_type, expires_in },
    } = await axios.post(
      "https://api.canva.com/rest/v1/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        code: code,
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
        refreshToken: refresh_token,
        tokenType: token_type,
        expiresIn: expires_in,
      },
      { where: { redirectUri } }
    );

    res.sendFile(
      path.join(__dirname, "../../views/pages/canvaoauthsuccess.html")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = authorizeV1;
