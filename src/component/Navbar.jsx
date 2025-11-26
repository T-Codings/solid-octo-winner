import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatIcon from "../assets/ChatIcon.jpg";
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

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-1">
          <div className="flex justify-center">
            <img src={ChatIcon} alt="Logo" className="h-8 w-8 mx-auto" />
          </div>

          <span className="text-xl font-semibold text-gray-900">
          chatApp
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!currentUser && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-600
               rounded-lg
                  hover:bg-indigo-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {currentUser && (
            <>
              <span className="text-gray-700">
                Hi, {currentUser.displayName || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
