const mongoose = require("mongoose");
const buyerSchema = new mongoose.Schema(
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
      enum: ["buyer", "admin"],
      default: "buyer",
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],

    reset: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Buyer = mongoose.model("Buyer", buyerSchema, "buyer");
module.exports = Buyer;
