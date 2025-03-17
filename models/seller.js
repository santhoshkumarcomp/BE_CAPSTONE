const mongoose = require("mongoose");
const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["seller", "admin"],
      default: "seller",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    prices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
      },
    ],
    reset: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Seller", sellerSchema, "seller");
