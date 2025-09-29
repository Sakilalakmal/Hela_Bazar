const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//! Add product to wishlist
export async function addToWishlist(productId, token) {
  const res = await fetch(`${API_URL}/wishlist/add/${productId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to add to wishlist");
  return res.json();
}

//! Get wishlist items
export async function getWishlist(token) {
  const res = await fetch(`${API_URL}/wishlist/all/items`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to get wishlist");
  return res.json();
}

//! Remove product from wishlist
export async function removeFromWishlist(productId, token) {
  const res = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error(
      (await res.json()).message || "Failed to remove from wishlist"
    );
  return res.json();
}
