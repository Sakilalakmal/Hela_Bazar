const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getProductById = async (productId, token) => {
  const response = await fetch(`${API_URL}/products/details/${productId}`, {
    // This matches your existing route
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }
  return data;
};

//Update product
export const updateProduct = async (productId, data, token) => {
  const formData = new FormData();

  // Add all primitive fields
  Object.entries(data).forEach(([key, value]) => {
    if (
      key === "images" ||
      key === "variants" ||
      key === "customizationOptions"
    )
      return;
    formData.append(
      key,
      typeof value === "boolean" || typeof value === "number"
        ? value.toString()
        : value
    );
  });

  // Images (if new ones are uploaded)
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((file) => formData.append("images", file));
  }

  // Variants (array of objects, send as JSON string)
  if (data.variants && data.variants.length > 0) {
    formData.append("variants", JSON.stringify(data.variants));
  }

  // Customization Options (array of objects, send as JSON string)
  if (data.customizationOptions && data.customizationOptions.length > 0) {
    formData.append(
      "customizationOptions",
      JSON.stringify(data.customizationOptions)
    );
  }

  const response = await fetch(`${API_URL}/products/update/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const resp = await response.json();
  if (!response.ok) throw new Error(resp.message || "Failed to update product");
  return resp;
};
