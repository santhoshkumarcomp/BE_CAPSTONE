const Seller = require("../models/seller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const sendMail = require("../utils/sendMail");
const fs = require("fs");
const authSellerController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const seller = await Seller.findOne({ email });
      if (seller) {
        return res.send("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newSeller = new Seller({
        name,
        email,
        password: hashedPassword,
      });
      await newSeller.save();
      res.send("register success");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const seller = await Seller.findOne({ email });
      if (!seller) {
        res.send("User not found");
      }
      const isPasswordCorrect = await bcrypt.compare(password, seller.password);
      if (!isPasswordCorrect) {
        res.status(500).send("Invalid credentials");
      }
      console.log(JWT_SECRET);
      const token = await jwt.sign({ sellerId: seller._id }, JWT_SECRET, {
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
      const sellerId = req.sellerId;
      const seller = await Seller.findById(sellerId).select(
        "name _id email role picture"
      );
      console.log(seller);
      res.json(seller);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  editMe: async (req, res) => {
    try {
      const sellerId = req.sellerId;
      const seller = await Seller.findById(sellerId);
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const picture = req.file.path;
      if (seller.picture.length > 0) {
        const filePath = seller.picture;

        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        seller.picture = picture;
      }
      seller.picture = picture;
      await seller.save();
      res.send("profile updated");
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const seller = await Seller.findOne({ email });
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
      await Seller.findByIdAndUpdate(seller._id, { reset: result });
      const sellerId = seller._id;
      await sendMail(
        email,
        "Link for password change",
        `http://localhost:3001/auth/updatepassword?result=${result}&userId=${sellerId}`
      );
      res.send("link sent to email");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const text = req.query.result;
      const sellerId = req.query.userId;
      const seller = await Seller.findById(sellerId);
      if (seller.reset == text) {
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
      const seller = await Seller.findOne({ email });
      if (!seller) {
        res.send("user not found");
      }
      if (seller.reset == text) {
        hashedPassword = await bcrypt.hash(password, 10);
        text = "";
        await Seller.findByIdAndUpdate(seller._id, {
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
module.exports = authSellerController;
