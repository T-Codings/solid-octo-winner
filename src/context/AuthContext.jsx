import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebaseConfig";

const AuthContext = createContext(null);

// ✅ Hook (ONLY ONCE)
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Signup
  async function signup(email, password) {
    setError("");
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err?.message || "Signup failed");
      throw err;
    }
  }

  // Login
  async function login(email, password) {
    setError("");
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err?.message || "Login failed");
      throw err;
    }
  }

  // Logout
  async function logout() {
    setError("");
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err?.message || "Logout failed");
      throw err;
    }
  }

  // Track user state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = {
    currentUser,
    logout,
    signup,
    login,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
