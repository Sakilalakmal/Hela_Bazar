const API_KEY = import.meta.env.VITE_API_KEY || "http://localhost:3000";

export async function registerUser(userData) {
  const res = await fetch(`${API_KEY}/user/register`, {
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

//!request to OTP for login
// send OTP to email
export async function sendOtp(email) {
  const res = await fetch(`${API_KEY}/request/otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send OTP");
  }

  return res.json(); // { message: "OTP sent successfully..." }
}
