import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addToWishlist } from "../services/wishlistService";
import toast from "react-hot-toast";
import { addToCart } from "../services/cartService";

function ProductCard({ product }) {
  const {
    _id,
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
  } = product;

  const { token } = useAuth();


  //! handle wishlist add
  const handleWishListAdd = async () => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const data = await addToWishlist(_id, token);
      toast.success(data.message || "Added to wishlist!");
    } catch (error) {
      toast.error(error.message || "Error adding to wishlist.");
    }
  };


  //! adding to cart
  const handleAddToCart = async()=>{
    if(!token){
      toast.error("Please login to add to cart");
      return;
    }

    try {
      const data = await addToCart(_id, 1, {}, token);
      toast.success(data.message || "Added to cart!");
    } catch (error) {
      toast.error(error.message || "Error adding to cart.");
    }
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : price;
  const hasDiscount = discount > 0;

  // Render star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-300 text-sm">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-sm">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const handleImageNavigation = (direction) => {
    if (images.length <= 1) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden group max-w-sm mx-auto">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-50 h-72">
        <Link to={`/products/${_id}`}>
          <img
            src={
              images?.[currentImageIndex] ||
              "https://via.placeholder.com/400x320?text=No+Image"
            }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x320?text=No+Image";
            }}
          />
        </Link>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => handleImageNavigation("prev")}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <span className="text-gray-600 text-sm">‹</span>
            </button>
            <button
              onClick={() => handleImageNavigation("next")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <span className="text-gray-600 text-sm">›</span>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
              -{discount}% OFF
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {stock > 0 ? (
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
              In Stock
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {brand || "No Brand"}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {category || "General"}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${_id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description || "No description available for this product."}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">{renderStars()}</div>
          <span className="text-sm font-medium text-gray-700">
            {rating > 0 ? rating.toFixed(1) : "0.0"}
          </span>
          {reviewCount > 0 && (
            <span className="text-xs text-gray-500">({reviewCount})</span>
          )}
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-green-600">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              stock > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={stock === 0}
            onClick={handleAddToCart}
          >
            {stock > 0 ? "Add to Cart" : "Sold Out"}
          </button>

          <button
            className="px-3 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={handleWishListAdd}
          >
            <span className="text-base">♡</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
