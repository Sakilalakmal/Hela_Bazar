const API_KEY = import.meta.env.VITE_API_KEY || "http://localhost:3000";

export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json(); // returns { _id, username, email, role }
}
