const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//! Add product to wishlist
export async function addToWishlist(productId, token) {
  const response = await fetch(`${API_URL}/wishlist/add/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok)
    throw new Error(
      (await response.json()).message || "Failed to add to wishlist"
    );
  return response.json();
}
