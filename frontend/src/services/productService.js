const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products/all/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchSingleProduct(productId) {
  const res = await fetch(`${API_URL}/products/details/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchReviewForSelectedproduct(productId) {
  const res = await fetch(`${API_URL}/reviews/product/${productId}`);
  if(!res.ok) throw new  Error("Failed to fetch Reviews");
  return res.json();
  
}
