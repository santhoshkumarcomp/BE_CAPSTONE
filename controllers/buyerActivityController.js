const Post = require("../models/post");
const Price = require("../models/price");
const Buyer = require("../models/buyer");
const sendMail = require("../utils/sendMail");
const buyerActivityController = {
  getAllPosts: async (req, res) => {
    try {
      const buyerId = req.buyerId;
      console.log(buyerId);
      const buyer = await Buyer.findById(buyerId).select("-password");

      const sellerPosts = await Post.find();
      console.log(buyer);
      res.json({ buyer, sellerPosts });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
  getPost: async (req, res) => {
    try {
      const id = req.params.id;
      const postId = id;
      const post = await Post.findById(id)
        .populate("author", "name _id ")
        .select("picture");
      const priceHistory = await Price.find({ postId })
        .populate("buyerName", "")
        .sort({ createdAt: -1 });
      res.json({ post, priceHistory });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  bidPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const buyerId = req.buyerId;
      const post = await Post.findById(postId);
      let { price } = req.body;
      const bidPrice = price;
      console.log(bidPrice);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.initialPrice >= bidPrice) {
        return res.send("Bid amount not accepted");
      }
      if (post.topPrice >= bidPrice) {
        return res.send("Bid is not highest");
      }
      if (!post.topPrice || post.topPrice < bidPrice) {
        await Post.findByIdAndUpdate(post._id, { topPrice: bidPrice });
        const newPrice = new Price({
          buyerName: req.buyerId,
          biddingPrice: bidPrice,
          postId: postId,
        });
        await newPrice.save();

        if (post.bidders.length > 0) {
          prevId = post.bidders[post.bidders.length - 1];
          const buyer = await Buyer.findById(prevId);
          if (prevId != buyerId) {
            await sendMail(
              buyer.email,
              "Attention you have been outbid @ Auction's",
              `Login and then increase the bid price If you want to. New Price is ${bidPrice}`
            );
          } else {
            await sendMail(
              buyer.email,
              "Your bid @ Auction's",
              `Your bid : ${bidPrice}, the life span of the bid is half hour`
            );
          }
        }

        post.bidders.push(req.buyerId);
        await post.save();

        return res.json("bid is top price");
      }

      res.send(` message : ${bidPrice}`);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  sealedBidPost: async (req, res) => {
    try { 
      const postId = req.params.id;
      const post = await Post.findById(postId);
      let { price } = req.body;
      const initialPrice = price;
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.initialPrice >= initialPrice) {
        return res.send("Bid amount not accepted");
      }

      if (!post.bidders.includes(req.buyerId)) {
        const newPrice = new Price({
          buyerName: req.buyerId,
          biddingPrice: initialPrice,
          postId: postId,
        });
        await newPrice.save();
        post.bidders.push(req.buyerId);
        await post.save();
        return res.send("sealed bid post");
      }
      res.send("one bid per user");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  reverseBidPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const buyerId = req.buyerId;
      const post = await Post.findById(postId);
      let { price } = req.body;
      const bidPrice = price;
      console.log(bidPrice);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.initialPrice <= bidPrice) {
        return res.send("Bid amount not accepted");
      }
      if (post.topPrice <= bidPrice) {
        return res.send("Bid is not lowest");
      }
      if (!post.topPrice || post.topPrice > bidPrice) {
        await Post.findByIdAndUpdate(post._id, { topPrice: bidPrice });
        const newPrice = new Price({
          buyerName: req.buyerId,
          biddingPrice: bidPrice,
          postId: postId,
        });
        await newPrice.save();

        if (post.bidders.length > 0) {
          prevId = post.bidders[post.bidders.length - 1];
          const buyer = await Buyer.findById(prevId);
          if (prevId != buyerId) {
            await sendMail(
              buyer.email,
              "Attention you have been outbid @ Auction's",
              `Login and then decres the bid price If you want to. New Price is ${bidPrice}`
            );
          } else {
            await sendMail(
              buyer.email,
              "Your bid @ Auction's",
              `Your bid : ${bidPrice}, the life span of the bid is half hour`
            );
          }
        }

        post.bidders.push(req.buyerId);
        await post.save();

        return res.json("bid is top price");
      }

      res.send(` message : ${bidPrice}`);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
};
module.exports = buyerActivityController;
