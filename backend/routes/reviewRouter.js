const express = require("express");
const isAuthenticatedUser = require("../middlewares/auth_user");
const reviewsController = require("../controllers/reviews_controller");
const reviewRouter = express.Router();

reviewRouter.post("/add", isAuthenticatedUser, reviewsController.createReview);

reviewRouter.get("/product/:productId", reviewsController.getReviewsForProduct);

reviewRouter.patch(
  "/update/:reviewId",
  isAuthenticatedUser,
  reviewsController.updateReview
);

reviewRouter.delete(
  "/delete/:reviewId",
  isAuthenticatedUser,
  reviewsController.deleteReview
);

reviewRouter.get(
  "/get/for/order",
  isAuthenticatedUser,
  reviewsController.getUserReviewForOneOrder
);

module.exports = reviewRouter;
