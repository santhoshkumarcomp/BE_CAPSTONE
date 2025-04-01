const Buyer = require("../models/buyer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const sendMail = require("../utils/sendMail");
const fs = require("fs");
const authBuyerController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const buyer = await Buyer.findOne({ email });
      if (buyer) {
        return res.send("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newBuyer = new Buyer({
        name,
        email,
        password: hashedPassword,
      });
      await newBuyer.save();
      res.send("register success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const buyer = await Buyer.findOne({ email });
      if (!buyer) {
        res.send("User not found");
      }
      const isPasswordCorrect = await bcrypt.compare(password, buyer.password);
      if (!isPasswordCorrect) {
        return res.status(500).send("Invalid credentials");
      }
      console.log(JWT_SECRET);
      const token = await jwt.sign({ buyerId: buyer._id }, JWT_SECRET, {
        expiresIn: "3h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 3 * 60 * 60 * 1000,
        secure: true,
        path: "/",
      });
      res.send("logged in");
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      res.send("logout route");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  me: async (req, res) => {
    try {
      const buyerId = req.buyerId;
      const buyer = await Buyer.findById(buyerId).select(
        "name _id email role picture"
      );
      res.json(buyer);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  editMe: async (req, res) => {
    try {
      const buyerId = req.buyerId;
      const buyer = await Buyer.findById(buyerId);
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const picture = req.file.path;
      if (buyer.picture.length > 0) {
        const filePath = buyer.picture;

        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        buyer.picture = picture;
      }
      buyer.picture = picture;
      await buyer.save();
      res.send("profile updated");
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const buyer = await Buyer.findOne({ email });
      if (!user) {
        throw new Error("user not found");
      }
      stringLength = 10;
      characters = "abcdefghijklmnopqrstuvwxyz";
      let result = "";
      for (let i = 0; i < stringLength; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      await Buyer.findByIdAndUpdate(buyer._id, { reset: result });
      const buyerId = buyer._id;
      await sendMail(
        email,
        "Link for password change",
        `http://localhost:3001/auth/updatepassword?result=${result}&userId=${buyerId}`
      );
      res.send("link sent to email");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const text = req.query.result;
      const buyerId = req.query.userId;
      const buyer = await Buyer.findById(buyerId);
      if (buyer.reset == text) {
        return res.redirect(`http://localhost:5173/updatepassword/${text}`);
      }
      res.send("invalid password change string");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  resetPassword: async (req, res) => {
    try {
      let text = req.params.text;
      const { email, password } = req.body;
      const buyer = await Buyer.findOne({ email });
      if (!buyer) {
        res.send("user not found");
      }
      if (buyer.reset == text) {
        hashedPassword = await bcrypt.hash(password, 10);
        text = "";
        await Buyer.findByIdAndUpdate(buyer._id, {
          password: hashedPassword,
          reset: text,
        });
      }
      res.send("password updated successfully");
    } catch (error) {
      res.status(500).send("ensure you get the link via registered email");
    }
  },
};
module.exports = authBuyerController;
