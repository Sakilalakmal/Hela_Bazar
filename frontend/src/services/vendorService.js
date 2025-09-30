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
