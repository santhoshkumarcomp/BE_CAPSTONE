const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    initialPrice: {
      type: Number,
    },
    bidders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    topPrice: {
      type: Number,
    },

    options: {
      type: String,
      enum: ["traditional", "reverse", "sealed"],
      default: "traditional",
    },
    traditionalWon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    reverseWon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    sealedWon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    picture: {
      type: String,
      default: "",
    },
    biddingPrice: [{ type: mongoose.Schema.Types.ObjectId, ref: "Price" }],
    closed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", postSchema, "post");
