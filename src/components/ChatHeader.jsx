import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, collection, getDocs, writeBatch, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import phoneIcon from "../assets/phonefill.png";
import videoIcon from "../assets/majesticonsvideo.png";
import moreIcon from "../assets/more.png";
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
    <div className="flex items-center justify-between px-4 py-3 bg-white rounded-t-xl shadow-md border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={contact.photoURL || avatarFallback}
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
          />
          {/* Online indicator */}
          {contact.isOnline && (
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-slate-900">{displayName}</span>
          {contact.status && (
            <span className="text-xs text-slate-500 mt-1">{contact.status}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <img src={phoneIcon} alt="Call" className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 transition">
          <img src={videoIcon} alt="Video" className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100 transition" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={moreIcon} alt="More" className="w-6 h-6" />
        </button>
      </div>
      {/* Dropdown menu example */}
      {menuOpen && (
        <div ref={menuRef} className="absolute top-16 right-6 bg-white border border-slate-200 rounded-xl shadow-lg py-2 px-4 z-50">
          <button className="block w-full text-left py-2 hover:bg-slate-100 rounded">Mute chat</button>
          <button className="block w-full text-left py-2 hover:bg-slate-100 rounded">View profile</button>
          <button className="block w-full text-left py-2 hover:bg-slate-100 rounded text-red-600">Delete chat</button>
        </div>
      )}
    </div>
  );
}
