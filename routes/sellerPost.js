const express = require("express");
const { isAuthenticatedSeller } = require("../middlewares/auth");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const upload = require("../middlewares/upload");
const sellerPostRouter = express.Router();

sellerPostRouter.post(
  "/createpost",
  isAuthenticatedSeller,
  upload.single("picture"),
  createPost
);
sellerPostRouter.get("/getposts", isAuthenticatedSeller, getAllPosts);
sellerPostRouter.get("/postbyid/:id", isAuthenticatedSeller, getPost);
sellerPostRouter.put(
  "/postbyid/:id",
  isAuthenticatedSeller,
  upload.single("picture"),
  updatePost
);
sellerPostRouter.delete("/postbyid/:id", isAuthenticatedSeller, deletePost);

module.exports = sellerPostRouter;
