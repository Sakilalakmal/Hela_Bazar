const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//! Add product to wishlist
export async function addToWishlist(productId, token) {
  const res = await fetch(`${API_URL}/wishlist/add/${productId}`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to add to wishlist");
  return res.json();
}