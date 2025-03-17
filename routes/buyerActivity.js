const express = require("express");
const {
  bidPost,
  sealedBidPost,
  getAllPosts,
  getPost,
  reverseBidPost,
} = require("../controllers/buyerActivityController");
const { isAuthenticatedBuyer, isPostClosed } = require("../middlewares/auth");
const buyerActivityRouter = express.Router();

buyerActivityRouter.get("/getposts", isAuthenticatedBuyer, getAllPosts);
buyerActivityRouter.get("/postbyid/:id", isAuthenticatedBuyer, getPost);
buyerActivityRouter.put(
  "/buyerbid/:id",
  isAuthenticatedBuyer,
  isPostClosed,
  bidPost
);
buyerActivityRouter.post(
  "/buyerbid/:id",
  isAuthenticatedBuyer,
  isPostClosed,
  sealedBidPost
);
buyerActivityRouter.patch(
  "/buyerbid/:id",
  isAuthenticatedBuyer,
  isPostClosed,
  reverseBidPost
);

module.exports = buyerActivityRouter;
