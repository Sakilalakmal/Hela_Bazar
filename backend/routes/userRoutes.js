const express = require('express');
const userController = require('../controllers/user_controller');
const userRouter = express.Router();


userRouter.post('/user/register',userController.registerUser);
userRouter.post('/user/login',userController.loginUser);
userRouter.post('/request/otp',userController.otpSend);

module.exports = userRouter;