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
} = require("../controllers/authSellerController");
const { isAuthenticatedSeller } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const authSellerRouter = express.Router();

authSellerRouter.post("/register", register);
authSellerRouter.post("/login", login);
authSellerRouter.get("/logout", logout);
authSellerRouter.get("/me", isAuthenticatedSeller, me);
authSellerRouter.post("/forgotPassword", forgotPassword);
authSellerRouter.get("/updatepassword", updatePassword);
authSellerRouter.post("/resetpassword/:text", resetPassword);
authSellerRouter.put(
  "/editprofile",
  isAuthenticatedSeller,
  upload.single("picture"),
  editMe
);

module.exports = authSellerRouter;
