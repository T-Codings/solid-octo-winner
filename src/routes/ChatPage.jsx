// src/routes/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function ChatPage() {
  const { currentUser } = useAuth();
  const { contactId } = useParams();

  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !contactId) return;

    setLoading(true);

    // ✅ Listen to ONLY the selected contact doc
    const ref = doc(db, "contacts", currentUser.uid, "list", contactId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setSelectedContact(null);
        } else {
          setSelectedContact({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load selected contact:", err);
        setSelectedContact(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser, contactId]);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white">
      {/* Left: Sidebar always visible */}
      <Sidebar />

      {/* Right */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Loading chat...
          </div>
        ) : (
          <ChatArea selectedContact={selectedContact} />
        )}
      </div>
    </div>
  );
}
