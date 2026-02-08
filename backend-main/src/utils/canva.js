const crypto = require("crypto");
const { CanvaOauth } = require("../models");
const sendMail = require("../services/mail");
const {
  CANVA_AUTH_REDIRECT_URI,
  CANVA_CLIENT_ID,
  CANVA_CLIENT_SECRET,
  CANVA_AUTHORIZED_PERSON_EMAIL,
} = require("../config/env");

const codeVerifier = crypto.randomBytes(96).toString("base64url");

const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64url");

const clientId = CANVA_CLIENT_ID;
const originalRedirectUri = CANVA_AUTH_REDIRECT_URI;
const redirectUri = encodeURIComponent(originalRedirectUri);

const authorizationUrl = `https://www.canva.com/api/oauth/authorize?code_challenge_method=s256&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=design:content:read%20design:meta:read%20design:permission:read&code_challenge=${codeChallenge}`;

async function createCanvaOauth() {
  await CanvaOauth.destroy({
    where: {
      redirectUri: originalRedirectUri,
    },
  });

  await CanvaOauth.create({
    codeVerifier,
    codeChallenge,
    redirectUri: originalRedirectUri,
    authorizationUrl,
  });

  await sendMail({
    to: CANVA_AUTHORIZED_PERSON_EMAIL,
    subject: "Canva OAuth",
    viewFileName: "auth/canva.oauth",
    content: {
      authorizationUrl,
    },
  });

  console.log("Canva OAuth created");

  process.exit(0);
}

createCanvaOauth();
