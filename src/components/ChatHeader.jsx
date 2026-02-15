// src/chats/ChatAreaHeader.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

import phoneIcon from "../assets/phonefill.png";
import videoIcon from "../assets/majesticonsvideo.png";
import moreIcon from "../assets/more2fill.png";

function safeName(c) {
  const full =
    c?.fullName ||
    c?.name ||
    `${c?.firstName || ""} ${c?.lastName || ""}`.trim() ||
    c?.email ||
    "Unknown";
  return full || "Unknown";
}

function buildChatId(a, b) {
  return [a, b].filter(Boolean).sort().join("_");
}

export default function ChatAreaHeader({ contact }) {
  const { currentUser } = useAuth();

  if (!contact) return null;

  const avatarFallback = `${import.meta.env.BASE_URL}avatar.png`;
  const displayName = useMemo(() => safeName(contact), [contact]);

  // normalize ids
  const contactUid = contact?.uid || contact?.id || "";
  const myUid = currentUser?.uid || "";

  // Last conversation details
  const lastMsg = contact.lastMessage || "No messages yet.";
  const lastMsgTime = contact.lastMessageAtMs
    ? new Date(contact.lastMessageAtMs).toLocaleString()
    : "";

  // Sender: currentUser, Receiver: contact
  const senderProfile = {
    name:
      currentUser?.displayName ||
      currentUser?.fullName ||
      currentUser?.email ||
      "Me",
    photoURL: currentUser?.photoURL || avatarFallback,
    email: currentUser?.email || "",
  };

  const receiverProfile = {
    name: displayName,
    photoURL: contact.photoURL || avatarFallback,
    email: contact.email || "",
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(!!contact?.muted);
  const [showContact, setShowContact] = useState(false);
  const [busy, setBusy] = useState(false);

  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on ESC
  useEffect(() => {
    if (!menuOpen && !showContact) return;

    function onKey(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowContact(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, showContact]);

  async function handleDeleteMessages() {
    if (!myUid || !contactUid) return;
    if (!window.confirm("Delete all messages in this chat?")) return;

    setBusy(true);
    try {
      const chatId = buildChatId(myUid, contactUid);
      const msgsRef = collection(db, "chats", chatId, "messages");
      const snap = await getDocs(msgsRef);

      // batch in chunks (Firestore batch limit is 500)
      let batch = writeBatch(db);
      let count = 0;

      for (const d of snap.docs) {
        batch.delete(d.ref);
        count++;
        if (count === 450) {
          await batch.commit();
          batch = writeBatch(db);
          count = 0;
        }
      }

      if (count > 0) await batch.commit();
    } catch (e) {
      console.error("Clear messages failed:", e);
      alert(e?.message || "Failed to clear messages.");
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  async function handleDeleteChat() {
    if (!myUid || !contactUid) return;
    if (!window.confirm("Delete this chat?")) return;

    setBusy(true);
    try {
      const chatId = buildChatId(myUid, contactUid);

      // 1) delete messages subcollection
      const msgsRef = collection(db, "chats", chatId, "messages");
      const snap = await getDocs(msgsRef);

      let batch = writeBatch(db);
      let count = 0;

      for (const d of snap.docs) {
        batch.delete(d.ref);
        count++;
        if (count === 450) {
          await batch.commit();
          batch = writeBatch(db);
          count = 0;
        }
      }
      if (count > 0) await batch.commit();

      // 2) delete chat doc
      await deleteDoc(doc(db, "chats", chatId));
    } catch (e) {
      console.error("Delete chat failed:", e);
      alert(e?.message || "Failed to delete chat.");
    } finally {
      setBusy(false);
      setMenuOpen(false);
    }
  }

  function handleViewContact() {
    setShowContact(true);
    setMenuOpen(false);
  }

  function handleCloseContact() {
    setShowContact(false);
  }

  async function handleMute() {
    if (!myUid || !contactUid) {
      setMuted((m) => !m);
      setMenuOpen(false);
      return;
    }

    const next = !muted;
    setMuted(next);
    setMenuOpen(false);

    try {
      const ref = doc(db, "contacts", myUid, "list", contactUid);
      await setDoc(
        ref,
        {
          muted: next,
          mutedAt: serverTimestamp(),
          mutedAtMs: Date.now(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Mute update failed:", e);
      setMuted((m) => !m);
      alert(e?.message || "Failed to update mute.");
    }
  }

  return (
    // ✅ STICKY HEADER
    <div className="sticky top-0 z-40 flex flex-col gap-2 p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {/* Sender profile */}
        <img
          src={senderProfile.photoURL}
          alt={senderProfile.name}
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = avatarFallback;
          }}
        />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">
            {senderProfile.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {senderProfile.email}
          </div>
        </div>

        <span className="mx-2 text-slate-400">→</span>

        {/* Receiver profile */}
        <img
          src={receiverProfile.photoURL}
          alt={receiverProfile.name}
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = avatarFallback;
          }}
        />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 truncate">
            {receiverProfile.name}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {receiverProfile.email}
          </div>
        </div>
      </div>

      {/* Last conversation details */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-slate-500">Last message:</span>
        <span className="text-sm text-slate-700 font-medium truncate">
          {lastMsg}
        </span>
        {lastMsgTime && (
          <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">
            {lastMsgTime}
          </span>
        )}
      </div>

      {/* Actions + Menu */}
      <div className="flex items-center gap-2 mt-1">
        <button
          title="Call"
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-60"
          disabled={busy}
        >
          <img src={phoneIcon} alt="Call" className="w-6 h-6" />
        </button>

        <button
          title="Video"
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-60"
          disabled={busy}
        >
          <img src={videoIcon} alt="Video" className="w-6 h-6" />
        </button>

        <div className="relative ml-auto" ref={menuRef}>
          <button
            title="More"
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-60"
            onClick={() => setMenuOpen((v) => !v)}
            disabled={busy}
          >
            <img src={moreIcon} alt="More" className="w-6 h-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                onClick={handleViewContact}
              >
                View Contact
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Media, Links, Docs
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Search
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                onClick={handleMute}
                disabled={busy}
              >
                {muted ? "Unmute Notifications" : "Mute Notifications"}
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800 disabled:opacity-60"
                onClick={handleDeleteMessages}
                disabled={busy}
              >
                Clear Messages
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 disabled:opacity-60"
                onClick={handleDeleteChat}
                disabled={busy}
              >
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for contact info */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleCloseContact();
          }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={contact.photoURL || avatarFallback}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  if (e.currentTarget.dataset.fallbackApplied) return;
                  e.currentTarget.dataset.fallbackApplied = "1";
                  e.currentTarget.src = avatarFallback;
                }}
              />
              <div className="min-w-0">
                <div className="font-bold text-lg text-gray-900 truncate">
                  {displayName}
                </div>
                {contact.email && (
                  <div className="text-gray-500 text-sm truncate">
                    {contact.email}
                  </div>
                )}
                {contact.phoneNumber && (
                  <div className="text-gray-500 text-sm truncate">
                    {contact.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                onClick={handleCloseContact}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
