import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "-createdAt", // newest first
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalProducts: 0,
    totalPages: 0,
  });

  // Fetch filtered products function - FIXED
  const fetchFilteredProducts = async (currentFilters = filters, page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...currentFilters,
        page: page.toString(),
        limit: pagination.pageSize.toString(),
      });

      // Remove empty values
      Object.keys(currentFilters).forEach(key => {
        if (!currentFilters[key]) {
          queryParams.delete(key);
        }
      });

      // FIXED: Added /api/ and authorization header
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/products/filtered?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      }

      const data = await response.json();

      setProducts(data.products || []);
      setPagination({
        page: data.page || 1,
        pageSize: data.pageSize || 12,
        totalProducts: data.totalProducts || 0,
        totalPages: data.totalPages || 0,
      });
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.message || 'Failed to fetch products');
      setLoading(false);
      setError(err.message);
    }
  };

  // Initial load - wait for token to be available
  useEffect(() => {
    fetchFilteredProducts();
  }, [token]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchFilteredProducts(newFilters, 1); // Reset to page 1 when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "-createdAt",
    };
    setFilters(clearedFilters);
    fetchFilteredProducts(clearedFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchFilteredProducts(filters, newPage);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5D866C] mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-[#5D866C]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex">
      {/* Fixed Left Sidebar - Filter Panel */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg border-r border-[#E6D8C3] overflow-y-auto z-10">
        <div className="p-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#5D866C]">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-[#C2A68C] hover:text-[#5D866C] underline transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Search Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#5D866C] mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] bg-[#F5F5F0] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#5D866C] mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] bg-[#F5F5F0] transition-all"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="beauty">Beauty</option>
              <option value="toys">Toys</option>
              <option value="automotive">Automotive</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#5D866C] mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-3 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] bg-[#F5F5F0] transition-all"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-3 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] bg-[#F5F5F0] transition-all"
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#5D866C] mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-4 py-2 border border-[#C2A68C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D866C] bg-[#F5F5F0] transition-all"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
              <option value="-name">Name: Z to A</option>
            </select>
          </div>

          {/* Active Filters Display */}
          <div className="border-t border-[#E6D8C3] pt-4">
            <h3 className="text-sm font-semibold text-[#5D866C] mb-2">Active Filters</h3>
            <div className="space-y-1">
              {filters.search && (
                <div className="flex items-center justify-between bg-[#E6D8C3] px-2 py-1 rounded text-xs">
                  <span>Search: "{filters.search}"</span>
                  <button 
                    onClick={() => handleFilterChange('search', '')} 
                    className="text-[#5D866C] hover:text-red-500 font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.category && (
                <div className="flex items-center justify-between bg-[#E6D8C3] px-2 py-1 rounded text-xs">
                  <span>Category: {filters.category}</span>
                  <button 
                    onClick={() => handleFilterChange('category', '')} 
                    className="text-[#5D866C] hover:text-red-500 font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <div className="flex items-center justify-between bg-[#E6D8C3] px-2 py-1 rounded text-xs">
                  <span>Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}</span>
                  <button 
                    onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }} 
                    className="text-[#5D866C] hover:text-red-500 font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Products Grid */}
      <div className="flex-1 ml-80">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#5D866C] mb-4">Our Products</h1>
            <div className="flex items-center justify-between">
              <p className="text-lg text-[#C2A68C]">
                Discover amazing products at unbeatable prices
              </p>
              <span className="bg-[#E6D8C3] text-[#5D866C] px-4 py-2 rounded-full font-semibold">
                {pagination.totalProducts} Products Found
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loading && products.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5D866C] mr-2"></div>
                <span className="text-[#5D866C]">Updating results...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error Loading Products</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-[#5D866C] mb-2">No Products Found</h2>
              <p className="text-[#C2A68C] mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="bg-[#5D866C] text-white px-6 py-2 rounded-lg hover:bg-[#5D866C]/80 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pagination.page === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E6D8C3] text-[#5D866C] hover:bg-[#C2A68C] hover:text-white'
                }`}
              >
                Previous
              </button>
              
              {/* Show max 5 page numbers */}
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                let pageNumber;
                if (pagination.totalPages <= 5) {
                  pageNumber = index + 1;
                } else {
                  // Smart pagination logic
                  const start = Math.max(1, pagination.page - 2);
                  const end = Math.min(pagination.totalPages, start + 4);
                  pageNumber = start + index;
                  if (pageNumber > end) return null;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pagination.page === pageNumber
                        ? 'bg-[#5D866C] text-white'
                        : 'bg-[#E6D8C3] text-[#5D866C] hover:bg-[#C2A68C] hover:text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pagination.page === pagination.totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E6D8C3] text-[#5D866C] hover:bg-[#C2A68C] hover:text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;