import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data.products); // from backend
        setLoading(false);
        
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">⚠️ Error Loading Products</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices
          </p>
          <div className="mt-6">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
              {products.length} Products Available
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h2>
            <p className="text-gray-500">Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;