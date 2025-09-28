import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProducts } from "../components/productService";

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
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <Link to={`/products/${p._id}`} key={p._id}>
            <div className="border rounded p-4 shadow hover:shadow-lg transition">
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
              <p className="text-gray-600">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
