import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notebook, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LEFT LOGO */}
          <Link to="/" className="flex items-center space-x-1">
            <Notebook className="h-8 w-8 text-indigo-600 ml-2" />
            <span className="text-xl font-semibold text-gray-900">
              QuickNotes
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                {/* USER EMAIL + ICON */}
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">{currentUser.email}</span>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-600 
                  hover:text-indigo-600 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="text-sm font-medium text-white px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  SignUp
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
