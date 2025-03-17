const express = require("express");
const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  updatePassword,
  resetPassword,
  editMe,
} = require("../controllers/authBuyerController");
const { isAuthenticatedBuyer } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const authBuyerRouter = express.Router();

authBuyerRouter.post("/register", register);
authBuyerRouter.post("/login", login);
authBuyerRouter.get("/logout", logout);
authBuyerRouter.get("/me", isAuthenticatedBuyer, me);
authBuyerRouter.post("/forgotPassword", forgotPassword);
authBuyerRouter.get("/updatepassword", updatePassword);
authBuyerRouter.post("resetpassword/:text", resetPassword);
authBuyerRouter.put(
  "/editprofile",
  isAuthenticatedBuyer,
  upload.single("picture"),
  editMe
);
module.exports = authBuyerRouter;
