// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const loc = useLocation();

  const [checking, setChecking] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!currentUser) {
        if (alive) setChecking(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        const data = snap.exists() ? snap.data() : null;
        const c = Number(data?.profileCompletion ?? 0);
        const complete = Boolean(data?.profileComplete) && c >= 75;

        if (alive) setProfileComplete(complete);
      } catch {
        if (alive) setProfileComplete(false);
      } finally {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [currentUser]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  // ✅ prevent /contacts or /chat access until profile complete
  const mustComplete =
    loc.pathname.startsWith("/contacts") || loc.pathname.startsWith("/chat");

  if (mustComplete && !profileComplete) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
