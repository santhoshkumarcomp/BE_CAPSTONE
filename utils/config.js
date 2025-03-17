require("dotenv").config();
MONGODB_URI = process.env.MONGODB_URI;
PORT = process.env.PORT;
JWT_SECRET = process.env.JWT_SECRET;
EMAIL_ID = process.env.EMAIL_ID;
EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  EMAIL_ID,
  EMAIL_PASS,
};
