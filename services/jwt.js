const jwt = require("jsonwebtoken");

// Create a random 6 digits OTP

const sign = (otp, expiresIn = "5m") => {
  const token = jwt.sign({ otp }, process.env.JWT_SECRET, {
    expiresIn
  });
  return token;
};

function verify(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { sign, verify };

