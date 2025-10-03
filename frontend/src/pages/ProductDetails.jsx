import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../services/productService";
import { fetchReviewForSelectedproduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { addToWishlist } from "../services/wishlistService";
import { addToCart } from "../services/cartService";
import { updateReview, deleteReview } from "../services/orderService";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { user, token } = useAuth();
  const [wishMsg, setWishMsg] = useState("");
  const [customization, setCustomization] = useState("");
  const [cartMsg, setCartMsg] = useState("");

  // Review Management States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: 5,
    reviewText: "",
  });

  // Delete confirmation states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSingleProduct(id)
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchReviews = () => {
    setReviewLoading(true);
    fetchReviewForSelectedproduct(id)
      .then((data) => {
        // Handle both success and graceful failure cases
        setReviews(data.reviews || []);
        setReviewLoading(false);
        
        // Only log errors that aren't "no reviews found"
        if (data.success === false && data.message !== "No reviews found for this product") {
          console.warn("Reviews could not be loaded:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews([]); // Set empty array instead of leaving undefined
        setReviewLoading(false);
        // Don't show error toast - just silently handle it for better UX
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Review Management Functions
  const openEditModal = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      reviewText: review.reviewText,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingReview(null);
    setEditForm({ rating: 5, reviewText: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (!token) {
      toast.error("Please login to edit review");
      return;
    }

    setEditLoading(true);

    try {
      const response = await updateReview(
        editingReview._id,
        {
          rating: editForm.rating,
          reviewText: editForm.reviewText.trim(),
        },
        token
      );

      console.log("Update response:", response);
      toast.success("Review updated successfully!");
      closeEditModal();
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Edit error:", err);
      toast.error(err.message || "Failed to update review");
    }

    setEditLoading(false);
  };

  const openDeleteConfirm = (reviewId) => {
    setDeletingReviewId(reviewId);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeletingReviewId(null);
  };

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return;

    if (!token) {
      toast.error("Please login to delete review");
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await deleteReview(deletingReviewId, token);
      console.log("Delete response:", response);
      toast.success("Review deleted successfully!");
      closeDeleteConfirm();
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete review");
    }

    setDeleteLoading(false);
  };

  //! add to wishlist
  const addWishList = async () => {
    if (!token) {
      setWishMsg("You need to be logged in to add to wishlist");
      return;
    }

    try {
      const data = await addToWishlist(product._id, token);
      setWishMsg(data.message || "Added to wishlist");
    } catch (error) {
      setWishMsg("Error adding to wishlist. Please try again.");
    }
  };

  //! add to cart
  const addTocartHandle = async () => {
    if (!token) {
      setCartMsg("You need to be logged in to add to cart");
      return;
    }

    try {
      const data = await addToCart(product._id, quantity, customization, token);
      setCartMsg(
        data.message ||
          `${product.name} added to cart now you can order it anytime...`
      );
    } catch (error) {
      setCartMsg("Error adding to cart. Please try again");
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-500 text-lg">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-500/70 text-lg">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-lg">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  // Check if current user owns the review
  const isReviewOwner = (review) => {
    if (!user || !review.userId) return false;

    const currentUserId = user.id || user._id;
    const reviewUserId = review.userId._id || review.userId;

    return String(currentUserId) === String(reviewUserId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">
            Product not found
          </p>
          <p className="text-blue-900">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    brand,
    category,
    description,
    price,
    discount = 0,
    stock,
    rating = 0,
    reviewCount = 0,
    images = [],
    vendorId,
    tags = [],
  } = product;

  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;
  const hasDiscount = discount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
                <img
                  src={
                    images[selectedImageIndex] ||
                    "https://via.placeholder.com/600x600?text=No+Image"
                  }
                  alt={name}
                  className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x600?text=No+Image";
                  }}
                />

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      -{discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-900 shadow-md"
                          : "border-blue-200 hover:border-blue-600"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Customization Options */}
              {product.customizationOptions &&
                product.customizationOptions.length > 0 && (
                  <div className="border-t border-blue-200 p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                      Available Customizations
                    </h2>
                    <div className="space-y-4">
                      {product.customizationOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                        >
                          <h3 className="font-semibold text-blue-900 mb-2">
                            {opt.type}
                          </h3>
                          {opt.values && opt.values.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-blue-800">
                              {opt.values.map((val, i) => (
                                <li key={i}>{val}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-blue-600 text-sm">
                              No details provided
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              {/* Brand & Category */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white bg-blue-900 px-3 py-1 rounded-full">
                  {brand || "No Brand"}
                </span>
                <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  {category || "General"}
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    stock > 0
                      ? "text-green-700 bg-green-50"
                      : "text-red-700 bg-red-50"
                  }`}
                >
                  {stock > 0 ? `${stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">
                  {name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                </div>
                <span className="text-lg font-semibold text-blue-900">
                  {rating > 0 ? rating.toFixed(1) : "0.0"}
                </span>
                {reviewCount > 0 && (
                  <span className="text-blue-600 hover:text-blue-900 hover:underline cursor-pointer transition-colors">
                    ({reviewCount} customer reviews)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-blue-200 py-4">
                <div className="flex items-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-blue-900">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                        You save ${(price - discountedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-blue-900">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              {vendorId && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Sold by
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {vendorId.username?.charAt(0).toUpperCase() || "V"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        {vendorId.username || "Unknown Vendor"}
                      </p>
                      <p className="text-sm text-blue-600">
                        {vendorId.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  Quantity:
                </span>
                <div className="flex items-center border border-blue-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-blue-50 transition-colors text-blue-900"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-blue-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-blue-50 transition-colors text-blue-900"
                    disabled={quantity >= stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="my-6">
                <label
                  htmlFor="customization"
                  className="block text-sm font-medium text-blue-900 mb-2"
                >
                  Customization (optional)
                </label>
                <textarea
                  id="customization"
                  name="customization"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                  placeholder="Describe any custom requests for this product (e.g., gift wrapping, engraving, special instructions)"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={addTocartHandle}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    stock > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? "Add to Cart" : "Currently Unavailable"}
                </button>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    stock > 0
                      ? "bg-blue-900 hover:bg-blue-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? "Buy Now" : "Out of Stock"}
                </button>

                <button
                  onClick={addWishList}
                  className="w-full py-3 px-6 bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 rounded-lg font-medium transition-all"
                >
                  Add to Wishlist ♡
                </button>

                {wishMsg && <p className="mt-2 text-blue-600">{wishMsg}</p>}
                {cartMsg && <p className="mt-2 text-blue-600">{cartMsg}</p>}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-900 text-sm font-medium px-3 py-1 rounded-full border border-blue-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Description Section */}
          <div className="border-t border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Product Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-blue-800 leading-relaxed text-lg">
                {description ||
                  "No detailed description available for this product."}
              </p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Basic Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Brand:</span>
                    <span className="font-medium text-blue-900">
                      {brand || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Category:</span>
                    <span className="font-medium text-blue-900">
                      {category || "General"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Stock:</span>
                    <span className="font-medium text-blue-900">
                      {stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Rating:</span>
                    <span className="font-medium text-blue-900">
                      {rating}/5 ({reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Review Section with Better Empty State */}
          <div className="border-t border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Customer Reviews
            </h2>

            {reviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mr-3"></div>
                <p className="text-blue-900">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-6xl mb-4">💭</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">No Reviews Yet</h3>
                <p className="text-blue-600 text-lg mb-4">
                  Be the first to share your experience with this product!
                </p>
                <p className="text-blue-600 text-sm">
                  Your review helps other customers make informed decisions.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Show review count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-blue-600 font-medium">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''} for this product
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                    </div>
                    <span className="text-blue-900 font-semibold">
                      {rating > 0 ? rating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>

                {reviews.map((review) => {
                  const isOwner = isReviewOwner(review);

                  return (
                    <div
                      key={review._id}
                      className="bg-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {review.userId?.username
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900 text-lg">
                              {review.userId?.username || "Anonymous User"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-blue-600 font-medium">
                                {review.rating}/5
                              </span>
                              {review.createdAt && (
                                <span className="text-sm text-blue-600 ml-2">
                                  • {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Edit/Delete Buttons - Only show for review owner */}
                        {isOwner && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(review)}
                              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors duration-200 flex items-center gap-2"
                            >
                              <span>✏️</span>
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(review._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                            >
                              <span>🗑️</span>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-blue-800 leading-relaxed text-base">
                        {review.reviewText || "No review text provided."}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Review Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEditModal}
          ></div>
          <div className="relative z-10 bg-white max-w-lg w-full rounded-2xl shadow-xl border border-blue-200 mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-blue-900">
                  Edit Review
                </h3>
                <button
                  onClick={closeEditModal}
                  className="text-blue-600 hover:text-red-500 text-2xl font-light transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-blue-900 font-semibold mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setEditForm({ ...editForm, rating: star })
                        }
                        className={`text-3xl transition-colors duration-200 hover:scale-110 ${
                          star <= editForm.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-blue-900 font-semibold mb-2">
                    Review
                  </label>
                  <textarea
                    value={editForm.reviewText}
                    onChange={(e) =>
                      setEditForm({ ...editForm, reviewText: e.target.value })
                    }
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-blue-100 text-blue-900 py-3 rounded-xl font-semibold hover:bg-blue-200 border border-blue-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </span>
                    ) : (
                      "Update Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteConfirm}
          ></div>
          <div className="relative z-10 bg-white max-w-md w-full rounded-2xl shadow-xl border border-blue-200 mx-4">
            <div className="p-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Delete Review?
                </h3>
                <p className="text-blue-600 mb-6">
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={closeDeleteConfirm}
                    className="flex-1 bg-blue-100 text-blue-900 py-3 rounded-xl font-semibold hover:bg-blue-200 border border-blue-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteReview}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;