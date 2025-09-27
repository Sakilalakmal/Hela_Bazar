const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const Otp = require("../model/otp_model");

const userController = {
  registerUser: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "please fill all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        message: " you have already account , please login",
      });
    }

    //hash password using bcryptjs
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user in hela bazar
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  }),

  loginUser: asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        messsage: "please provide email and otp",
      });
    }

    //check otp for this email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ message: "Otp not found..." });
    }

    if (otpRecord.otp !== otp || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid Otp" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ email });

    //generate web token for login user when user login in to sysytem
    const token = await jwt.sign(
      { id: userExists._id, role: userExists.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      _id: userExists._id,
      username: userExists.username,
      email: userExists.email,
      role: userExists.role,
      token: token,
    });
  }),

  otpSend: asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      //check user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      //generate otp
      let otp = generateOTP();
      let expiresAt = new Date(Date.now() + 30 * 1000); // OTP valid for 30 seconds

      // Remove any old OTPs for this email
      await Otp.deleteMany({ email });

      // Save new OTP to database
      await Otp.create({ email, otp, expiresAt });

      // Send OTP via email
      await sendEmail(
        email,
        `Your OTP for Hela Bazar login is: <b>${otp}</b><br>This OTP is valid for 30 seconds.`
      );

      res
        .status(200)
        .json({ message: "OTP sent successfully check your inbox " });
    } catch (error) {
      res.status(500).json({ message: "otp send error", error: error.message });
    }
  }),
};

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = userController;
