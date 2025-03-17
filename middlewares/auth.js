const Post = require("../models/post");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const auth = {
  isAuthenticatedBuyer: async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).send("unauthorized");
      }
      const decoded = await jwt.verify(token, JWT_SECRET);
      req.buyerId = decoded.buyerId;
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("unauthorised access");
    }
  },
  isAuthenticatedSeller: async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).send("unauthorized");
      }
      const decoded = await jwt.verify(token, JWT_SECRET);
      req.sellerId = decoded.sellerId;
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("unauthorised access");
    }
  },
  isPostClosed: async (req, res, next) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.closed) {
        return res.status(404).send("Auction closed");
      }
      next();
    } catch (error) {
      res.satus(500).send(error.message);
    }
  },
};
module.exports = auth;
