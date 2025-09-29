import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWishlist , removeFromWishlist ,clearWishlist} from "../services/wishlistService";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";

function Wishlist() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view your wishlist.");
      setLoading(false);
      return;
    }
    getWishlist(token)
      .then(data => {
        setWishlist(data.wishList);
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleRemoveWishListItem = async(productId)=>{
      try {
    await removeFromWishlist(productId, token);
    // Option 1: re-fetch wishlist
    const data = await getWishlist(token);
    setWishlist(data.wishList);
    toast.success("Item removed from wishlist.");
  } catch (err) {
    setMsg(err.message);
  }
  }

  const clearWishlistAll = async () => {
    try {
      await clearWishlist(token);
      setWishlist({ products: [] });
      toast.success("Wishlist cleared successfully now you can add new products...");
    } catch (err) {
      setMsg(err.message);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (msg) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <p className="text-xl font-semibold text-red-600 mb-2">Oops!</p>
              <p className="text-gray-600 max-w-md">{msg}</p>
              {msg.includes("log in") && (
                <Link
                  to="/login"
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Save items you love by clicking the heart icon. They'll appear here for easy shopping later!
              </p>
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{wishlist.products.length}</p>
              </div>
              
              {wishlist.products.length > 0 && (
                <button
                  onClick={clearWishlistAll}
                  className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.products.map((p) => (
            <div 
              key={p._id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
            >
              
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Link to={`/products/${p._id}`}>
                  <img
                    src={p.images?.[0] || "https://via.placeholder.com/300x240?text=No+Image"}
                    alt={p.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x240?text=No+Image";
                    }}
                  />
                </Link>
                
                {/* Remove Button - Top Right */}
                <button
                  onClick={() => handleRemoveWishListItem(p._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <span className="text-red-500 text-sm">✕</span>
                </button>

                {/* Wishlist Icon - Top Left */}
                <div className="absolute top-3 left-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">♥</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                
                {/* Brand */}
                {p.brand && (
                  <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2">
                    {p.brand}
                  </span>
                )}

                {/* Product Name */}
                <Link to={`/products/${p._id}`}>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {p.description ? 
                    (p.description.length > 80 ? p.description.slice(0, 80) + "..." : p.description) :
                    "No description available"
                  }
                </p>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-xl font-bold text-green-600">${p.price}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link 
                    to={`/products/${p._id}`}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => handleRemoveWishListItem(p._id)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
                    title="Remove from wishlist"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        {wishlist.products.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Shop?</h3>
              <p className="text-gray-600 mb-6">
                Continue browsing our collection to add more items to your wishlist
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/products"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearWishlistAll}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;