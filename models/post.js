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
    winner: {
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
