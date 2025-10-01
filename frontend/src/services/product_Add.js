// src/services/productService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Add Product (Vendor Only)
export const addProduct = async (data, token) => {
  // Data comes with images array inside data.images
  const formData = new FormData();

  // Add all primitive fields
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" || key === "variants" || key === "customizationOptions") return;
    // Booleans or numbers should be added as string
    formData.append(key, typeof value === "boolean" || typeof value === "number" ? value.toString() : value);
  });

  // Images (required, at least one)
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((file) => formData.append("images", file));
  }

  // Variants (array of objects, send as JSON string)
  if (data.variants && data.variants.length > 0) {
    formData.append("variants", JSON.stringify(data.variants));
  }

  // Customization Options (array of objects, send as JSON string)
  if (data.customizationOptions && data.customizationOptions.length > 0) {
    formData.append("customizationOptions", JSON.stringify(data.customizationOptions));
  }

  // Make the API call
  const res = await fetch(`${API_URL}/products/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type for FormData
    },
    body: formData,
  });

  const resp = await res.json();
  if (!res.ok) throw new Error(resp.message || "Failed to add product");
  return resp;
};
