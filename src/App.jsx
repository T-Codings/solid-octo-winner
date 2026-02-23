import React from "react";
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

function App() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <span className="w-10 h-10 mb-2 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-emerald-300 font-semibold text-lg">Loading ...</span>
        </div>
      </div>
    );
  }

  const goAfterAuth = userData?.profileComplete ? "/contacts" : "/profile";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        {/* Home / Landing: Always show landing page */}
        <Route
          path="/"
          element={<Landing />}
        />

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
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Contacts (Chat list + chat area view you already have) */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Chat route — contact click should navigate here */}
        <Route
          path="/chat/:contactId"
          element={
            <ProtectedRoute>
              <ChatPage />
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
