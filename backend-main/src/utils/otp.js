function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOTPExpirationDate(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = { generateOTP, generateOTPExpirationDate };
