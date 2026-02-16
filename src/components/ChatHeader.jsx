


import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, collection, getDocs, writeBatch, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import phoneIcon from "../assets/phonefill.png";
import videoIcon from "../assets/majesticonsvideo.png";
import moreIcon from "../assets/more2fill.png";
import onlineIndicator from "../assets/Rectangle6.png";
// Local safeName utility (not exported from updateLastMessage.js)
function safeName(u) {
  return (
    u?.fullName ||
    u?.name ||
    [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
    (u?.email ? u.email.split("@")[0] : "") ||
    "User"
  );
}
// buildChatId utility
function buildChatId(a, b) {
  return [a, b].sort().join("_");
}



export default function ChatAreaHeader({ contact }) {
  const { currentUser } = useAuth();
  if (!contact) return null;
  const avatarFallback = `${import.meta.env.BASE_URL}avatar.png`;
  const displayName = useMemo(() => safeName(contact), [contact]);

  // normalize ids
  const contactUid = contact?.uid || contact?.id || "";
  const myUid = currentUser?.uid || "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(!!contact?.muted); // optional field from firestore
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

  // ✅ persist mute to contacts list (optional, but recommended)
  async function handleMute() {
    if (!myUid || !contactUid) {
      // fallback to local only
      setMuted((m) => !m);
      setMenuOpen(false);
      return;
    }

    const next = !muted;
    setMuted(next);
    setMenuOpen(false);

    try {
      // Path you use elsewhere: contacts/{uid}/list/{contactUid}
      const ref = doc(db, "contacts", myUid, "list", contactUid);

      // Use setDoc merge so you don't accidentally wipe the contact document
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
      // revert local state if you want
      setMuted((m) => !m);
      alert(e?.message || "Failed to update mute.");
    }
  }

  return (
    // ✅ STICKY HEADER
    <div className="sticky top-0 z-40 flex items-center gap-3 p-4 font-semibold border-b bg-white">
      <div className="relative">
        <img
          src={contact.photoURL || avatarFallback}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = avatarFallback;
          }}
        />
        {/* Online indicator */}
        <img
          src={onlineIndicator}
          alt="Online"
          className="absolute bottom-0 text-sky-500 right-0 w-4 h-4"
          style={{ borderRadius: '50%', border: '2px solid white', background: 'white' }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-gray-900 truncate">{displayName}</div>
        {/* optional status line if you have it */}
        {typeof contact?.isOnline === "boolean" && (
          <div className="text-xs text-gray-500 text-sky-500">
            {contact.isOnline ? "Online" : "Offline"}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
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

        <div className="relative" ref={menuRef}>
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

      {/* ✅ Modal moved OUTSIDE the dropdown so it renders correctly */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            // click outside closes
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
