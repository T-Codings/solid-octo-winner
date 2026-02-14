// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  // ✅ only show "Checking..." while Firebase auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        Checking...
      </div>
    );
  }

  // ✅ not logged in -> go to login, keep where they wanted to go
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /**
   * ✅ If userData hasn't loaded (offline / slow Firestore),
   * don't block the whole app forever.
   * Let them continue, or you can choose to send them to /profile.
   */
  if (!userData) {
    return children; // best UX when offline
  }

  // ✅ force profile completion flow if needed
  const completion = Number(userData?.profileCompletion ?? 0);
  const complete = Boolean(userData?.profileComplete) || completion >= 75;

  if (!complete && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
