import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ AUTH FUNCTIONS (fix "signup is not a function")
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (!user) {
        setUserData(null);
        setUserDataLoading(false);
        return;
      }

      setUserDataLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setUserData(snap.exists() ? snap.data() : null);
      } catch (e) {
        console.error("Failed to load user doc:", e);
        setUserData(null);
      } finally {
        setUserDataLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      userData,
      setUserData,
      authLoading,
      userDataLoading,
      loading: authLoading || userDataLoading,

      // ✅ expose these so Signup.jsx can call them
      signup,
      login,
      logout,
    }),
    [currentUser, userData, authLoading, userDataLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
