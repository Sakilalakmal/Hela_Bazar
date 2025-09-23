const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../model/user_model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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
    const {email , password} = req.body;

    if(!email || !password){
        res.status(400).json({
            messsage:"please provide email and password"
        });
    }

    //check user by email if user exists in db throw true
    const userExists = await User.findOne({email});
    if(userExists && (await bcrypt.compare(password,userExists.password))){

        //generate web token for login user when user login in to sysytem
        const token = await jwt.sign({id:userExists._id,role:userExists.role},process.env.JWT_SECRET,{
            expiresIn:'30d'
        });

        res.status(201).json({
            _id:userExists._id,
            username:userExists.username,
            email:userExists.email,
            role:userExists.role,
            token:token
        });
    }

  }),
};

module.exports = userController;
