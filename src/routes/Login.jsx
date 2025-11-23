import React, { useState } from "react";
import { Notebook } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
    const[emial, setEmail] = useState("")
     const[password, setPassword] = useState("");
  return (
    <div className="max-w-md mx-auto mt-8 p-8">
      <div className="bg-white rounded-lg shadow-md pb-1">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Notebook className="h-12 w-12 text-indigo-600 mb-2 mt-6" />
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600">Sign in to access your notes</p>
        </div>

        {/* Form */}
        <form className="max-w-[90%] mx-auto">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border px-3 py-2 border-gray-300 rounded-md
              focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium mb-1">Password</label>

            <input
              id="password"
              type="password"
              placeholder="************"
              className="w-full border px-3 py-2 border-gray-300 rounded-md
              focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Button */}
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md 
            hover:bg-indigo-700 transition-colors focus:outline-none"
            type="submit"
          >
            Sign in
          </button>
        </form>

        {/* Signup link */}
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
