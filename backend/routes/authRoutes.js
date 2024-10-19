require("dotenv").config();
const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordHash = require("../utils/passHash");
const otpgenerator = require("otp-generator");
const emailSend = require("../utils/emailSend");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ error: true, message: "username is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }

  let existinguser = await userModel.findOne({ email });

  if (existinguser) {
    return res.json({ message: "user already exists" });
  }
  const otp = otpgenerator.generate(4, {
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
  console.log(otp);
  const otpExpires = Date.now() + 5 * 60 * 1000;

  try {
    const hashPassword = await passwordHash(password);
    let newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
      otp,
      otpExpires,
    });
    const emailResponse = await emailSend(email, otp);
    console.log(emailResponse);

    return res.json({ message: "verify your otp", userId: newUser._id });
  } catch (error) {
    console.log("Error during Registration:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

router.post("/verifyotp/:id", async (req, res) => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    if (!otp) {
      return res.json({ message: "OTP is required" });
    }

    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.json({ message: "Invalid user" });
    }

    if (otp === user.otp) {
      if (user.otpExpires > Date.now()) {
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true;

        await user.save();

        return res.json({
          message: "verification successfull",
          verified: true,
        });
      } else {
        return res.json({ message: "Otp has expired", verified: false });
      }
    } else {
      return res.json({ message: "Invalid Otp", verified: false });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      message: "Internal server Error . Please try again later",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: true, message: "email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ message: "Invalid Credentials", verified: false });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET
      );
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: "localhost",
      });

      return res.json({
        message: "login successful",
        verified: true,
        user: user,
      });
    } else {
      return res.json({ message: "Invalid Credentials", verified: false });
    }
  });
});

router.get("/isloggedin", async (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.json({ login: false, message: "user not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });
    res.json({ login: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ login: false });
  }
});

router.post("/verifyemail", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.json({ message: "Email is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Invalid Email" });
    }
    const otp = otpgenerator.generate(4, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });
    console.log(otp);
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.isVerified = false;

    await user.save();
    emailSend(email, otp);

    return res.json({ message: "otp has been sent", userid: user._id });
  } catch (error) {
    console.log("error verifying email:", error.message);
  }
});

router.post("/reset-password/:id", async (req, res) => {
  const { id } = req.params;
  const { newpassword } = req.body;

  try {
    if (!newpassword) {
      return res.json({ message: "password is required" });
    }

    const newhashpassword = await passwordHash(newpassword);

    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { password: newhashpassword }
    );
    if (!user) {
      return res.json({ message: "user not found" });
    }
    return res.json({ message: "password updated sucessfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: "error updating password" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  return res.json({ message: "logout successfully" });
});

module.exports = router;
