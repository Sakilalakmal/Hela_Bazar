import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../services/productService";
import { fetchReviewForSelectedproduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { addToWishlist } from "../services/wishlistService";
import { addToCart } from "../services/cartService";

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

  useEffect(() => {
    fetchSingleProduct(id)
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchReviewForSelectedproduct(id)
      .then((data) => {
        setReviews(data.reviews || []);
        setReviewLoading(false);
      })
      .catch(() => {
        setReviewLoading(false);
      });
  }, [id]);

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

  // Render star rating (reused from ProductCard)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-[#C2A68C] text-lg">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-[#C2A68C]/70 text-lg">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D866C] mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-[#5D866C]">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">
            Product not found
          </p>
          <p className="text-[#5D866C]">
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
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="w-full">
        {/* Main Product Layout */}
        <div className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-[#E6D8C3] rounded-xl overflow-hidden">
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
                          ? "border-[#5D866C] shadow-md"
                          : "border-[#E6D8C3] hover:border-[#C2A68C]"
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
                  <div className="border-t border-[#E6D8C3] p-8">
                    <h2 className="text-2xl font-bold text-[#5D866C] mb-4">
                      Available Customizations
                    </h2>
                    <div className="space-y-4">
                      {product.customizationOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className="bg-[#E6D8C3] p-4 rounded-lg border border-[#C2A68C]"
                        >
                          <h3 className="font-semibold text-[#5D866C] mb-2">
                            {opt.type}
                          </h3>
                          {opt.values && opt.values.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-[#5D866C]">
                              {opt.values.map((val, i) => (
                                <li key={i}>{val}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[#C2A68C] text-sm">
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
                <span className="text-sm font-medium text-[#5D866C] bg-[#E6D8C3] px-3 py-1 rounded-full">
                  {brand || "No Brand"}
                </span>
                <span className="text-sm text-[#C2A68C] bg-[#F5F5F0] px-3 py-1 rounded-full">
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
                <h1 className="text-3xl font-bold text-[#5D866C] mb-2">
                  {name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                </div>
                <span className="text-lg font-semibold text-[#5D866C]">
                  {rating > 0 ? rating.toFixed(1) : "0.0"}
                </span>
                {reviewCount > 0 && (
                  <span className="text-[#C2A68C] hover:text-[#5D866C] hover:underline cursor-pointer transition-colors">
                    ({reviewCount} customer reviews)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-[#E6D8C3] py-4">
                <div className="flex items-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-[#C2A68C]">
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
                    <span className="text-3xl font-bold text-[#5D866C]">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              {vendorId && (
                <div className="bg-[#E6D8C3] rounded-lg p-4 border border-[#C2A68C]">
                  <h3 className="text-sm font-semibold text-[#5D866C] mb-2">
                    Sold by
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5D866C] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {vendorId.username?.charAt(0).toUpperCase() || "V"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#5D866C]">
                        {vendorId.username || "Unknown Vendor"}
                      </p>
                      <p className="text-sm text-[#C2A68C]">
                        {vendorId.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#5D866C]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#C2A68C] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-[#E6D8C3] transition-colors text-[#5D866C]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-[#5D866C]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-[#E6D8C3] transition-colors text-[#5D866C]"
                    disabled={quantity >= stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="my-6">
                <label
                  htmlFor="customization"
                  className="block text-sm font-medium text-[#5D866C] mb-2"
                >
                  Customization (optional)
                </label>
                <textarea
                  id="customization"
                  name="customization"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#C2A68C] focus:outline-none focus:ring-2 focus:ring-[#5D866C] focus:border-[#5D866C] transition bg-[#F5F5F0]"
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
                      ? "bg-[#C2A68C] hover:bg-[#C2A68C]/80 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? "Add to Cart" : "Currently Unavailable"}
                </button>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    stock > 0
                      ? "bg-[#5D866C] hover:bg-[#5D866C]/80 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? "Buy Now" : "Out of Stock"}
                </button>

                <button
                  onClick={addWishList}
                  className="w-full py-3 px-6 bg-[#E6D8C3] hover:bg-[#C2A68C]/20 text-[#5D866C] border border-[#C2A68C] rounded-lg font-medium transition-all"
                >
                  Add to Wishlist ♡
                </button>

                {wishMsg && <p className="mt-2 text-[#C2A68C]">{wishMsg}</p>}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#5D866C] mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-[#E6D8C3] text-[#5D866C] text-sm font-medium px-3 py-1 rounded-full border border-[#C2A68C]"
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
          <div className="border-t border-[#E6D8C3] p-8">
            <h2 className="text-2xl font-bold text-[#5D866C] mb-4">
              Product Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-[#5D866C] leading-relaxed text-lg">
                {description ||
                  "No detailed description available for this product."}
              </p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-[#E6D8C3] p-8">
            <h2 className="text-2xl font-bold text-[#5D866C] mb-4">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#E6D8C3] p-4 rounded-lg border border-[#C2A68C]">
                <h3 className="font-semibold text-[#5D866C] mb-2">
                  Basic Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#C2A68C]">Brand:</span>
                    <span className="font-medium text-[#5D866C]">
                      {brand || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C2A68C]">Category:</span>
                    <span className="font-medium text-[#5D866C]">{category || "General"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C2A68C]">Stock:</span>
                    <span className="font-medium text-[#5D866C]">{stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#C2A68C]">Rating:</span>
                    <span className="font-medium text-[#5D866C]">
                      {rating}/5 ({reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="border-t border-[#E6D8C3] p-8">
            <h2 className="text-2xl font-bold text-[#5D866C] mb-6">
              Customer Reviews
            </h2>
            {reviewLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D866C] mr-3"></div>
                <p className="text-[#5D866C]">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#C2A68C] text-lg">No reviews yet.</p>
                <p className="text-[#C2A68C] text-sm mt-2">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-[#E6D8C3] rounded-lg p-6 border border-[#C2A68C]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5D866C] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.userId?.username?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#5D866C]">
                            {review.userId?.username || "Anonymous User"}
                          </p>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-[#C2A68C] ml-2">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.createdAt && (
                        <span className="text-sm text-[#C2A68C]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-[#5D866C] leading-relaxed">
                      {review.reviewText || "No review text provided."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;