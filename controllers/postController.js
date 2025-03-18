const Post = require("../models/post");
const Seller = require("../models/seller");
const Price = require("../models/price");
const fs = require("fs");

const postController = {
  createPost: async (req, res) => {
    try {
      const { title, content, initialPrice, options } = req.body;
      const sellerId = req.sellerId;
      console.log(sellerId);
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const picture = req.file.path;

      // update the user's profile picture in the database

      if (options) {
        const newPost = new Post({
          title,
          content,
          initialPrice,
          author: sellerId,
          picture,
          options,
        });
        author = sellerId;
        await newPost.save();
      } else {
        const newPost = new Post({
          title,
          content,
          initialPrice,
          author: sellerId,
          picture,
        });
        author = sellerId;
        await newPost.save();
      }
      const sellerPosts = await Post.find({ author }).select("-password");
      console.log(sellerPosts);

      res.json(sellerPosts);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      console.log(sellerId);
      const seller = await Seller.findById(sellerId).select("-password");
      const author = sellerId;

      const sellerPosts = await Post.find({ author });
      console.log(seller);
      res.json({ seller, sellerPosts });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
  getPost: async (req, res) => {
    try {
      const id = req.params.id;
      const postId = id;
      const post = await Post.findById(id).populate("author", "name _id");
      const priceHistory = await Price.find({ postId })
        .populate("buyerName", "name _id picture")
        .sort({ createdAt: -1 });
      res.json({ post, priceHistory });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  updatePost: async (req, res) => {
    try {
      const id = req.params.id;
      const { title, content, initialPrice, options } = req.body;
      const post = await Post.findById(id);
      const filePath = post.picture;
      console.log(filePath);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      fs.unlinkSync(filePath);
      const sellerId = req.sellerId;
      console.log(sellerId);
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const picture = req.file.path;
      await Post.findByIdAndUpdate(id, {
        title,
        content,
        initialPrice,
        options,
        picture,
      });
      res.send("update post");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  deletePost: async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Post.findByIdAndDelete(id);
      await Price.deleteMany({ postId: post });
      const filePath = post.picture;
      console.log(filePath);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      fs.unlinkSync(filePath);
      console.log("File deleted successfully");
      res.send(" delete post");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updateValue: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      const author = sellerId;
      let posts = await Post.find({ author });
      if (!posts) {
        console.log("in return here");
        return;
      }
      posts.map(async (post) => {
        let dt = new Date(post.createdAt);
        const [date, time] = dt.toISOString().split("T");
        const t = time.split("Z");
        console.log(Date.now() - dt);
        if (Date.now() - dt > 1800000 && !post.closed) {
          await Post.findByIdAndUpdate(post._id, { closed: true });
        }
      });
      // posts = await Post.find({ author });
      // const closedPosts = posts.filter((post) => post.closed);
      res.json("Refreshed");
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = postController;
