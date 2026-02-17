import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Separate loading flags: auth vs userDoc
  const [authLoading, setAuthLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      // reset user data on logout
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

  const logout = async () => signOut(auth);

  const value = useMemo(
    () => ({
      currentUser,
      userData,
      setUserData, // ✅ allow Profile to update instantly
      authLoading,
      userDataLoading,
      loading: authLoading || userDataLoading, // optional combined flag
      logout,
    }),
    [currentUser, userData, authLoading, userDataLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
