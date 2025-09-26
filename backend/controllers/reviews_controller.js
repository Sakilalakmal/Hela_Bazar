const asyncHandler = require("express-async-handler");
const Order = require("../model/order_model");
const Product = require("../model/product_model");
const Review = require("../model/review_model");

const reviewsController = {
  createReview: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, orderId, rating, reviewText } = req.body;

      //input validations
      if (!productId || !orderId || !rating || !reviewText) {
        return res.status(400).json({
          message: "Please provide all required fields",
        });
      }

      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be a number between 1 and 5",
        });
      }

      const order = await Order.findOne({
        _id: orderId,
        customerId: userId,
        "products.productId": productId,
        status: "delivered",
      });

      if (!order) {
        return res.status(400).json({
          message:
            "You can only review products you have delivered this products",
        });
      }

      // Prevent duplicate reviews for this product/order/user
      const existingReview = await Review.findOne({
        productId,
        orderId,
        userId,
      });
      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this product for this order.",
        });
      }

      const product = await Product.findById(productId);

      // Create and save the new review
      const newReview = new Review({
        productId,
        vendorId: product.vendorId,
        userId,
        orderId,
        rating,
        reviewText,
      });

      await newReview.save();

      //update product's average rating and review count
      const allProductReviews = await Review.find({ productId });
      const averageRating =
        allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
        allProductReviews.length;
      product.rating = averageRating;
      product.reviewCount = allProductReviews.length;

      await product.save();

      res.status(201).json({
        message: "Review submitted successfully",
        review: newReview,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }),

  getReviewsForProduct: asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate(
      "userId",
      "username email"
    );

    if (!reviews || reviews.length === 0) {
      res.status(404).json({
        message: "No reviews found for this product",
      });
    }

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  }),

  updateReview: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { reviewId } = req.params;
      const { rating, reviewText } = req.body;

      const review = await Review.findById(reviewId);

      if (!review) {
        res.status(400).json({
          message: "This Review Does not exist",
        });
      }

      if (!reviewId || !rating || !reviewText) {
        res.status(400).json({
          message: "Please provide all required fields",
        });
      }

      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be a number between 1 and 5",
        });
      }

      //check if the current user is owner is this review
      if (String(review.userId) !== String(userId)) {
        return res.status(403).json({
          message: "You are not authorized to update this review",
        });
      }

      if (rating !== undefined) review.rating = rating;
      if (reviewText !== undefined) review.reviewText = reviewText;

      await review.save();
      res.status(200).json({
        message: "Review updated successfully",
        review,
      });

      //update product's average rating and review count
      const allProductReviews = await Review.find({
        productId: review.productId,
      });
      const averageRating =
        allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
        allProductReviews.length;

      const product = await Product.findByIdAndUpdate(
        review.productId,
        {
          rating: averageRating,
          reviewCount: allProductReviews.length,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "product rating updated successfully",
        product,
      });

      await product.save();
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }),
};

module.exports = reviewsController;
