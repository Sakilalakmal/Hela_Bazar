const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getMyOrders = async (token) => {
  try {
    const response = await fetch(`${API_URL}/orders/myOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
