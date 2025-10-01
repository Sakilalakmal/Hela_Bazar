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

//? review section in order page

// Add these functions to your existing orderService.js

// Get existing review for product/order
export const getUserReview = async (productId, orderId, token) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    }/reviews/get/for/order?productId=${productId}&orderId=${orderId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return { review: null }; // No review found, that's okay
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Create review
export const createReview = async (reviewData, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/reviews/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Update review
export const updateReview = async (reviewId, reviewData, token) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    }/reviews/update/${reviewId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};

// Delete review
export const deleteReview = async (reviewId, token) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:3000"
    }/reviews/delete/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
};
