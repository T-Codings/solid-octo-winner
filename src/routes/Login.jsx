import React, { useState } from "react";
import { Notebook } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in: " + (err.message || "Please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8">
      <div className="bg-white rounded-lg shadow-md pb-6">
        <div className="flex flex-col items-center mb-5">
          <Notebook className="h-12 w-12 text-indigo-600 mb-3 mt-6" />
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600">Sign in to access your notes</p>
        </div>

        {error && (
          <div
            className="bg-red-50 text-red-700 p-3
             rounded-md mb-4 text-sm"
          >
            {error}{""}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-[90%] mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 border-gray-300 rounded-md focus:outline-none bg-indigo-50"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="************"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 border-gray-300 rounded-md focus:outline-none bg-indigo-50"
              required
            />
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-2
             rounded-md hover:bg-indigo-700 transition-colors 
             focus:outline-none focus:ring-none
                focus:ring-none focus:ring-offset-2 bg-indigo-50
                disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-4 mb-6 text-gray-600 text-sm">
          <p>
            Don't have an account yet?
            <Link className="text-indigo-600 ml-1" to="/signup">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
