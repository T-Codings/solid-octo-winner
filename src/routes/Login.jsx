// src/routes/Login.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const { login, userData } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailTrimmed = useMemo(() => String(email || "").trim(), [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await login(emailTrimmed, password);
      const user = cred.user;
      let data = userData || null;
      if (!data) {
        const snap = await getDoc(doc(db, "users", user.uid));
        data = snap.exists() ? snap.data() : null;
      }
      setLoading(false);
      navigate("/dashboard"); // Navigate to dashboard after login
    } catch (err) {
      setError(err.message || "Failed to log in");
      setLoading(false);
    }
  };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Log In</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                disabled={loading}
              >
                <LogIn size={18} />
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline font-semibold">Sign Up</Link>
            </div>
          </div>
        </div>
      );
  // ...existing code...
}

export default Login;
