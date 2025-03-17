const mongoose = require("mongoose");
const priceSchema = new mongoose.Schema(
  {
    biddingPrice: {
      type: Number,
      default: 0,
    },
    buyerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", priceSchema, "price");
