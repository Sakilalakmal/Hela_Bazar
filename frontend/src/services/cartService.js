const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function addToCart(
  productId,
  quantity = 1,
  customization = {},
  token
) {
  const res = await fetch(`${API_URL}/orders/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ productId, quantity, customization }),
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to add to cart");
  return res.json();
}

//!get all cart items
export async function getCart(token) {
  const res = await fetch(`${API_URL}/orders/all/cart`, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to get cart");
  return res.json(); // { message, cart }
}

//! Remove item from cart
// Remove one item from cart
export async function removeFromCart(productId, token) {
  const res = await fetch(`${API_URL}/orders/cart/remove/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to remove item");
  return res.json();
}

//! remove cart item from list
export async function clearCart(token) {
  const res = await fetch(`${API_URL}/orders/cart/removeAll`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to clear cart");
  return res.json();
}
