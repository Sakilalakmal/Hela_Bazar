const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const placeOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/myOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to place order");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
