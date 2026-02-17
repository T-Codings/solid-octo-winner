import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Loader2 className="w-10 h-10 animate-spin" />
      <span className="ml-3 font-semibold">{label}</span>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading, userDataLoading } = useAuth();
  const location = useLocation();

  // ✅ critical: while auth/userData are loading, DO NOT Navigate anywhere
  if (authLoading || userDataLoading) {
    return <FullPageLoader label="Preparing..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
