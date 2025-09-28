import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleProduct } from "../components/productService";

function ProductDetails() {
  const { id } = useParams(); // get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSingleProduct(id)
      .then((data) => {
        setProduct(data.product); // backend returns { product: {...} }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p className="text-red-500">Product not found</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <p className="text-lg text-gray-700">{product.description}</p>
      <p className="text-2xl font-semibold mt-4">${product.price}</p>
    </div>
  );
}

export default ProductDetails;
