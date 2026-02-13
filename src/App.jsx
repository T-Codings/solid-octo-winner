// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// FIXED paths: folder is "components"
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatApp from "./components/ChatApp"; // <- fixed

// Routes
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Landing from "./routes/Landing";
import Profile from "./context/Profile";

import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser, userData, loading } = useAuth();

 if (loading) {
   return (
     <div className="min-h-screen flex flex-col items-center justify-center text-indigo-600">
       <div className="w-16 h-16 border-16 border-transparent border-t-gradient-to-r from-blue-500 to-green-500 rounded-full animate-spin mb-4"></div>
       <span>Loading...</span>
     </div>
   );
 }


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        {/* Home / Landing */}
        <Route
          path="/"
          element={
            currentUser ? (
              userData?.profileComplete ? (
                <Navigate to="/contacts" replace />
              ) : (
                <Navigate to="/profile" replace />
              )
            ) : (
              <Landing />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            currentUser ? (
              userData?.profileComplete ? (
                <Navigate to="/contacts" replace />
              ) : (
                <Navigate to="/profile" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/" replace /> : <Signup />}
        />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Contacts / ChatApp */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ChatApp />
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
