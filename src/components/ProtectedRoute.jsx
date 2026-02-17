// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        Checking...
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (userData && userData.profileComplete === false) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
