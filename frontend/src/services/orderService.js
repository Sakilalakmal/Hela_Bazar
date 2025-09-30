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

//! get details about one selected order
export const getOrderDetails = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/detials/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch order details");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

//! caancel order
export const cancelOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/cancel/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to cancel order");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
