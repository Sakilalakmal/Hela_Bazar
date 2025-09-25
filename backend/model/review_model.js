const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorApplication", // Optional: for vendor-wide review
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true, // Enforces "verified purchase"
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: edit history, images, likes, etc.
});

ReviewSchema.index(
  { productId: 1, userId: 1, orderId: 1 },
  { unique: true }
); // Prevents duplicate review by same user on same product/order

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;