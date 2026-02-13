// src/routes/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import ChatIcon from "../assets/chaticon.png";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCred = await signup(email, password);
      const user = userCred.user;

      // Correct Firestore structure for Profile.jsx
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: "",
        lastName: "",
        contact: "",
        fullName: "",
        photoURL: "",
        profileComplete: false,
        contacts: [],
        createdAt: new Date(),
      });

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-cyan-700 justify-center px-2 py-8">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-4 border border-blue-100">
        <div className="flex flex-col items-center mb-4">
          <img src={ChatIcon} className="h-10 w-10 mb-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Create Account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-2 rounded mb-3 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-3">
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border px-2 py-1 rounded-md text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              className="w-full border px-2 py-1 rounded-md text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 mt-4 -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-1 text-sm">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="************"
              className="w-full border px-2 py-1 rounded-md text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 mt-4 -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md text-white font-bold text-sm bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-3 text-gray-600 text-sm">
          <p>
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-indigo-600 hover:opacity-80"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
