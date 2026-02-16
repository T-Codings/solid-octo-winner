// src/routes/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function ChatPage() {
  const { currentUser } = useAuth();
  const { contactId } = useParams();

  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="h-[calc(100vh-64px)] flex bg-white relative">
      {/* Sidebar: overlay on mobile, static on desktop */}
      <div className="hidden md:block">
        <Sidebar onSelectContact={() => {}} />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="w-[85vw] max-w-xs h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <Sidebar onSelectContact={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white/80 rounded-xl p-2 shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
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
