import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../services/productService";
import { fetchReviewForSelectedproduct } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews,setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading , setReviewLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchSingleProduct(id)
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(()=>{
    fetchReviewForSelectedproduct(id).then((data)=>{
      setReviews(data.reviews || []);
      setReviewLoading(false);
    }).catch(()=>{
      setReviewLoading(false);
    });
  },[id]);

  // Render star rating (reused from ProductCard)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-300 text-lg">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-lg">☆</span>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Product not found</p>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
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
    tags = []
  } = product;

  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
  const hasDiscount = discount > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Product Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={images[selectedImageIndex] || "https://via.placeholder.com/600x600?text=No+Image"}
                  alt={name}
                  className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
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
                          ? 'border-blue-500 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
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
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              
              {/* Brand & Category */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {brand || "No Brand"}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {category || "General"}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  stock > 0 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-red-700 bg-red-50'
                }`}>
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {rating > 0 ? rating.toFixed(1) : "0.0"}
                </span>
                {reviewCount > 0 && (
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    ({reviewCount} customer reviews)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-red-600">
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
                    <span className="text-3xl font-bold text-gray-900">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Info */}
              {vendorId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Sold by</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {vendorId.username?.charAt(0).toUpperCase() || 'V'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendorId.username || 'Unknown Vendor'}</p>
                      <p className="text-sm text-gray-600">{vendorId.email || 'No email provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    stock > 0
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
                </button>
                
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all ${
                    stock > 0
                      ? 'bg-orange-400 hover:bg-orange-500 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={stock === 0}
                >
                  {stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </button>

                <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all">
                  Add to Wishlist ♡
                </button>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-purple-50 text-purple-600 text-sm font-medium px-3 py-1 rounded-full border border-purple-200"
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
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {description || "No detailed description available for this product."}
              </p>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{brand || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{category || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{rating}/5 ({reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

{/* Review Section - Fix this part */}
<div className="border-t border-gray-200 p-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
  {reviewLoading ? (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      <p className="text-gray-600">Loading reviews...</p>
    </div>
  ) : reviews.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg">No reviews yet.</p>
      <p className="text-gray-400 text-sm mt-2">Be the first to review this product!</p>
    </div>
  ) : (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {review.userId?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {review.userId?.username || 'Anonymous User'}
                </p>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            </div>
            {review.createdAt && (
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed">
            {review.reviewText || 'No review text provided.'}
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