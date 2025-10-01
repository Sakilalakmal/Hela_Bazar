import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getVendorProducts, deleteProduct } from "../services/vendorService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

function MyProducts() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [deletingProductId, setDeletingProductId] = useState(null);
  
  // Add these states for the custom dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    getVendorProducts(token)
      .then((data) => {
        setProducts(data.products);
        setProductCount(data.productCount);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Could not load your products");
        setLoading(false);
      });
  }, [token, navigate]);

  // Updated delete product handler to use custom dialog
  const handleDeleteClick = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeletingProductId(productToDelete.id);
    setShowDeleteDialog(false);
    
    try {
      await deleteProduct(productToDelete.id, token);
      
      // Remove the deleted product from the local state
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productToDelete.id));
      setProductCount(prevCount => prevCount - 1);
      
      toast.success(`"${productToDelete.name}" has been deleted successfully!`);
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeletingProductId(null);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
              <p className="text-gray-600">
                Manage your product listings ({productCount} products)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Profile
              </button>
              <button
                onClick={() => navigate('/vendor/add-product')}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          <div className="w-20 h-1 bg-blue-900 rounded-full mt-4"></div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to the marketplace</p>
            <button
              onClick={() => navigate('/add-product')}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                
                {/* Product Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Error';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center ml-2">
                      <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs text-green-600 ml-1">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Category: {product.category}</span>
                    <span className={`px-2 py-1 rounded-full ${product.isFeatured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.isFeatured ? 'Featured' : 'Regular'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                      className="flex-1 bg-blue-900 text-white py-2 px-2 rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id, product.name)}
                      disabled={deletingProductId === product._id}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                        deletingProductId === product._id
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {deletingProductId === product._id ? (
                        <div className="flex items-center justify-center">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ConfirmDialog with blurred background - Same as Orders.jsx */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <ConfirmDialog
              open={showDeleteDialog}
              title="Delete Product"
              message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will permanently remove the product and all its images.`}
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProducts;