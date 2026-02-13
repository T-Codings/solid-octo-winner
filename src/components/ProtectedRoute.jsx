// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        } finally {
          setFetching(false);
        }
      } else {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        Checking...
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (userData && userData.profileComplete === false) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
