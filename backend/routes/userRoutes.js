const express = require("express");
const userController = require("../controllers/user_controller");
const userRouter = express.Router();

userRouter.post("/user/register", userController.registerUser);
userRouter.post("/user/login", userController.loginUser);
userRouter.post("/request/otp", userController.otpSend);
userRouter.post("/change/email", userController.changeEmail);
userRouter.post("/confirm/changed-email", userController.confirmChangeEmail);

module.exports = userRouter;
