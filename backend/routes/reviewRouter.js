const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const reviewsController = require("../controllers/reviews_controller");
const reviewRouter = express.Router();

reviewRouter.post(
  "/add/:productId",
  isAuthenticatedUser,
  reviewsController.createReview
);

module.exports = reviewRouter;
