// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar"; // Your upgraded Sidebar
import Landing from "./routes/Landing"; // Direct imports
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Dashboard from "./routes/Dashboard";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Landing />
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />

        {/* Protected Dashboard with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-slate-100">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
