import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllProducts, deleteProduct } from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(token);
      setProducts(response.products || response.allProducts || []);
      toast.success('Products loaded successfully');
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setDeletingId(productId);
      await deleteProduct(productId, token);
      
      // Update local state
      setProducts(prev => prev.filter(product => product._id !== productId));
      
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setSelectedProduct(null);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-300' };
    if (stock <= 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800 border-green-300' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Product Management</h1>
        <p className="text-blue-100">Manage all products in the marketplace</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-blue-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">In Stock</p>
              <p className="text-3xl font-bold text-blue-900">
                {products.filter(product => product.stock > 10).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-blue-900">
                {products.filter(product => product.stock > 0 && product.stock <= 10).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
              ⚠️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-blue-900">
                {products.filter(product => product.stock === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🚫
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by title, description, or vendor..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-blue-600 text-sm">
          Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
        {currentProducts.length === 0 ? (
          <div className="p-12 text-center text-blue-400">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Products Found</h3>
            <p>No products match your current search and filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {currentProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock || 0);
              return (
                <div 
                  key={product._id} 
                  className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-blue-100">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-400 text-4xl">
                        📦
                      </div>
                    )}
                    
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-blue-900 text-lg mb-2 line-clamp-2">
                      {product.title || 'Unnamed Product'}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 text-sm">Price:</span>
                        <span className="font-semibold text-blue-900">
                          {formatPrice(product.price || 0)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 text-sm">Stock:</span>
                        <span className="font-semibold text-blue-900">
                          {product.stock || 0} units
                        </span>
                      </div>
                      
                      {product.category && (
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 text-sm">Category:</span>
                          <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                            {product.category}
                          </span>
                        </div>
                      )}
                      
                      {product.vendor && (
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 text-sm">Vendor:</span>
                          <span className="text-blue-700 text-sm font-medium">
                            {product.vendor}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetailsModal(product)}
                        className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        disabled={deletingId === product._id}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === product._id ? '⏳' : '🗑️'} Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-blue-50 px-6 py-4 flex items-center justify-between border-t border-blue-200">
            <div className="text-sm text-blue-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = Math.max(1, currentPage - 2) + index;
                if (pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10">
            <div className="bg-red-500 text-white p-6 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🗑️ Delete Product
              </h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-semibold text-gray-900">{selectedProduct.title}</p>
                <p className="text-gray-600 text-sm">{formatPrice(selectedProduct.price || 0)}</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={closeModals}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(selectedProduct._id)}
                  disabled={deletingId === selectedProduct._id}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === selectedProduct._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-10 flex flex-col">
            <div className="bg-blue-900 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Product Details</h2>
                <button
                  onClick={closeModals}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedProduct.images[0]} 
                        alt={selectedProduct.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {selectedProduct.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.images.slice(1, 4).map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${selectedProduct.title} ${index + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-blue-100 rounded-lg flex items-center justify-center text-blue-400 text-6xl">
                      📦
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{selectedProduct.title}</h3>
                    <p className="text-blue-700">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <label className="text-sm font-semibold text-blue-700">Price</label>
                      <p className="text-blue-900 font-bold text-lg">{formatPrice(selectedProduct.price || 0)}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded">
                      <label className="text-sm font-semibold text-blue-700">Stock</label>
                      <p className="text-blue-900 font-bold">{selectedProduct.stock || 0} units</p>
                    </div>
                    
                    {selectedProduct.category && (
                      <div className="bg-blue-50 p-3 rounded">
                        <label className="text-sm font-semibold text-blue-700">Category</label>
                        <p className="text-blue-900">{selectedProduct.category}</p>
                      </div>
                    )}
                    
                    {selectedProduct.vendor && (
                      <div className="bg-blue-50 p-3 rounded">
                        <label className="text-sm font-semibold text-blue-700">Vendor</label>
                        <p className="text-blue-900">{selectedProduct.vendor}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedProduct.createdAt && (
                    <div className="bg-blue-50 p-3 rounded">
                      <label className="text-sm font-semibold text-blue-700">Created Date</label>
                      <p className="text-blue-900">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t flex gap-4 flex-shrink-0">
              <button
                onClick={() => {
                  closeModals();
                  openDeleteModal(selectedProduct);
                }}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Delete Product
              </button>
              <button
                onClick={closeModals}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;