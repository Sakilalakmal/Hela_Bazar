import { useState } from "react";
import { sendOtp,loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function AuthPage() {

    const navigate = useNavigate();
  const [step, setStep] = useState("otp"); // 'otp' or 'login'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: OTP Send
  const handleOtpSend = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      setMessage("OTP sent! Please check your email.");
      setStep("login"); // move to login form
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Step 2: Login with OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, otp });
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      setMessage("Login successful!");
      navigate("/"); // redirect to home or dashboard
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      {step === "otp" ? (
        <form onSubmit={handleOtpSend} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Login — Request OTP</h1>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter your email"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter OTP"
            required
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default AuthPage;
