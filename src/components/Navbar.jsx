// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Chaticon from "../assets/chaticon.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const getUsernameFromEmail = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Chaticon} alt="Logo" className="h-8 w-8" />
        </Link>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {!currentUser && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-[#49BCF9] font-semibold rounded-lg border border-[#49BCF9] hover:bg-[#49BCF9]/10 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700 hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {currentUser && (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {getUsernameFromEmail(currentUser.email)}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 font-semibold rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
