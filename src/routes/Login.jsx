// src/routes/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatIcon from "../assets/chaticon.png";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen
     bg-cyan-700
      flex items-center justify-center px-2 py-
8"
    >
      <div
        className="w-full max-w-sm bg-white
      rounded-lg shadow-md p-6 -mt-12"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <img src={ChatIcon} className="h-10 w-10 mb-2" />
          <h2 className="text-xl font-semibold text-gray-900">Login</h2>
          <p className="text-gray-600 text-sm">
            Welcome back!
          </p>
          <p className="text-gray-600 text-sm">
            Enter your details to login
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded mb-3 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              className="w-full border px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#49BCF9] focus:border-[#49BCF9]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              className="w-full border px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#49BCF9] focus:border-[#49BCF9]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-2 mt-4 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white font-bold text-sm bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-3 text-gray-600 text-sm">
          <p>
            Don’t have an account?
            <Link
              to="/signup"
              className="ml-1 font-semibold bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700 bg-clip-text text-transparent hover:opacity-80"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
