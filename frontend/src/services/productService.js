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
  try {
    const res = await fetch(`${API_URL}/reviews/product/${productId}`);

    // If the response is not ok, check if it's a 404 (no reviews found)
    if (!res.ok) {
      if (res.status === 404) {
        // Return empty reviews array for 404 (no reviews found)
        return {
          success: true,
          message: "No reviews found for this product",
          reviews: [],
          reviewCount: 0,
        };
      }
      // For other errors, throw
      throw new Error(`Failed to fetch reviews: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Return empty reviews instead of throwing error
    return {
      success: false,
      message: "Could not load reviews",
      reviews: [],
      reviewCount: 0,
    };
  }
}
