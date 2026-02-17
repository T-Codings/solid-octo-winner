// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatApp from "./components/ChatApp";
import ChatPage from "./routes/ChatPage";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Landing from "./routes/Landing";
import Profile from "./context/Profile"; // keep if this is your real path

import { useAuth } from "./context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  const { currentUser, loading: authLoading } = useAuth();

  // ✅ Always read profileComplete from Firestore directly
  // This avoids "userData flicker" causing /profile <-> /contacts blinking
  const [profileLoading, setProfileLoading] = useState(!!currentUser);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setProfileLoading(false);
      setProfileComplete(false);
      return;
    }

    setProfileLoading(true);

    const ref = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.exists() ? snap.data() : null;
        const c = Number(data?.profileCompletion ?? 0);
        const complete = Boolean(data?.profileComplete) || c >= 75;

        setProfileComplete(complete);
        setProfileLoading(false);
      },
      () => {
        setProfileComplete(false);
        setProfileLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-indigo-600">
        <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin mb-4" />
        <span>Loading...</span>
      </div>
    );
  }

  const goAfterAuth = currentUser
    ? profileComplete
      ? "/contacts"
      : "/profile"
    : "/login";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<Landing />} />

        {/* Login */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to={goAfterAuth} replace /> : <Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={currentUser ? <Navigate to={goAfterAuth} replace /> : <Signup />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              {/* ✅ if already complete, never show profile */}
              {profileComplete ? <Navigate to="/contacts" replace /> : <Profile />}
            </ProtectedRoute>
          }
        />

        {/* Contacts */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              {/* ✅ if not complete, never show contacts */}
              {!profileComplete ? <Navigate to="/profile" replace /> : <ChatApp />}
            </ProtectedRoute>
          }
        />

        {/* Chat page */}
        <Route
          path="/chat/:contactId"
          element={
            <ProtectedRoute>
              {!profileComplete ? <Navigate to="/profile" replace /> : <ChatPage />}
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
