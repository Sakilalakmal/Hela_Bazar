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
