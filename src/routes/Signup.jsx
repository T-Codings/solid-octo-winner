


import React, { useState } from "react";
import { Notebook } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const {signup} =useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if(!email || !password || !passwordConfirm){
      return setError("Please fill in all fields")
    }

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

  
    if (password.length < 6) {
      return setError("Password must not be less than 6 characters");
    }

    try {
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account: ' +(err.message || 'Please try again'))
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="max-w-md mx-auto mt-12 p-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6 ">
          <Notebook className="h-12 w-12 text-indigo-600 mb-2 mt-6" />

          <h2 className="text-2xl font-semibold text-gray-900">
            Create Your Account
          </h2>
          <p className="text-gray-600">Start taking your notes today</p>
        </div>

        {
          error && (
            <div className="bg-red-50 text-red-700 p-3
             rounded-md mb-4 text-sm">
              {error}{""}
          </div>)
        }

        <form onSubmit={handleSubmit}
        class="max-w-[90%] mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-meduim text-gray-700 mb-1">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 border border-gray-300
                rounded-md focus:outline-none focus:ring-none
                focus:ring-none focus:ring-offset-2 bg-indigo-50
                disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label className="block mb-1">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              placeholder="************"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 border border-gray-300
                rounded-md focus:outline-none focus:ring-none
                focus:ring-none focus:ring-offset-2
                bg-indigo-50 
                disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />

            <div className="mb-6 mt-6">
              <label html for="password-confirm" className="block mb-1">
                Confirm Password
              </label>
              <input
                id="password-confirm"
                type="password"
                value={passwordConfirm}
                placeholder="************"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full border px-3 py-2 border border-gray-300
                rounded-md focus:outline-none focus:ring-none
                focus:ring-none focus:ring-offset-2
                bg-indigo-50
                disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 text-white
               py-2 rounded-md hover:bg-indigo-700 transition-colors
               focus:outline-none focus:ring-2 focus:ring-indigo-500
               focus:ring-offset-2 disabled:opacity-50
               disabled:cursor-not-allowed mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="h-10 text-center mt-4 text-gray-600 text-sm">
          <p>
            Don't have an account yet?
            <Link className="text-indigo-600 ml-1" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
