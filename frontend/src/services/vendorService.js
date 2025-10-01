const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getVendorProfile = async (token) => {
  const res = await fetch(`${API_URL}/vendor/profile/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok)
    throw new Error(
      (await res.json()).message || "Failed to fetch vendor profile"
    );
  return res.json();
};

//! update profile route
// services/vendorService.js
export const updateVendorProfile = async (formData, token) => {
  const res = await fetch(`${API_URL}/vendor/update`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error((await res.json()).message || "Update failed");
  return res.json();
};

//! get all product is for vendor
// In src/services/vendorService.js, add this function:

export const getVendorProducts = async (token) => {
  const response = await fetch(`${API_URL}/vendors/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch vendor products");
  }
  return data;
};

//! delete product by vendor
// Add this function to your existing vendorService.js

export const deleteProduct = async (productId, token) => {
  const response = await fetch(`${API_URL}/products/delete/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }
  return data;
};

//! get vendor orders
// Add this function to your existing orderService.js

export const getVendorOrders = async (token) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/vendor/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};
