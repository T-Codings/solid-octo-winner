// src/routes/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export default function ChatPage() {
    // Handler to mark contact as read in sidebar
    const handleReadContact = (contactId) => {
      setReadContacts((prev) => prev.includes(contactId) ? prev : [...prev, contactId]);
    };
  const { currentUser } = useAuth();
  const { contactId } = useParams();

  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // LIFT readContacts state here
  const [readContacts, setReadContacts] = useState([]);

  useEffect(() => {
    if (!currentUser || !contactId) return;
    setLoading(true);
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

  const navigate = useNavigate ? useNavigate() : (() => {});
  const isMobile = window.innerWidth < 768;
  const handleSidebarSelectContact = (contact) => {
    const contactId = contact.id || contact.uid;
    if (!contactId) return;
    navigate(`/chat/${contactId}`);
    setSelectedContact(contact);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white relative">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar onSelectContact={handleSidebarSelectContact} readContacts={readContacts} />
      </div>
      {/* Mobile: show only sidebar if no contact selected */}
      {isMobile && !contactId && (
        <div className="block md:hidden w-full h-full">
          <Sidebar onSelectContact={handleSidebarSelectContact} readContacts={readContacts} />
        </div>
      )}
      {/* Mobile: show only chat if contact selected */}
      {isMobile && contactId && (
        <div className="block md:hidden w-full h-full">
          <button
            className="absolute top-4 left-4 z-50 bg-white/80 rounded-xl p-2 shadow"
            onClick={() => window.location.href = '/contacts'}
            aria-label="Back to contacts"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="w-8 h-8 mb-2 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
                <span className="text-sky-600 font-semibold text-base">Loading chat...</span>
              </div>
            ) : (
              <ChatArea selectedContact={selectedContact} onReadContact={handleReadContact} />
            )}
          </div>
        </div>
      )}
      {/* Desktop chat area */}
      {!isMobile && (
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Loading chat...
            </div>
          ) : (
            <ChatArea selectedContact={selectedContact} onReadContact={handleReadContact} />
          )}
        </div>
      )}
    </div>
  );
}
