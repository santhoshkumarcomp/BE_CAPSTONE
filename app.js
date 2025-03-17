const express = require("express");
const authBuyerRouter = require("./routes/authBuyer");
const authSellerRouter = require("./routes/authSeller");
const logger = require("./middlewares/logger");
const cookieParser = require("cookie-parser");
const errorRoute = require("./middlewares/errorRoute");
const app = express();
app.use("/uploads", express.static("uploads"));
const cron = require("node-cron");
const cors = require("cors");
const sellerPostRouter = require("./routes/sellerPost");
const buyerActivityRouter = require("./routes/buyerActivity");
app.use(
  cors({
    origin: "https://subtle-kleicha-aa8606.netlify.app", // allow to server to accept request from different origin

    credentials: true, // or '*' to allow any origin (not recommended for production)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.get("/auth/status", (req, res) => {
  // Check if the auth cookie is valid
  if (req.cookies.token) {
    // Perform validation to check if the cookie is still valid
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.use("/auth/buyer", authBuyerRouter);
app.use("/auth/seller", authSellerRouter);
app.use("/seller/post", sellerPostRouter);
app.use("/buyer/post", buyerActivityRouter);
app.use(errorRoute);
module.exports = app;
