// src/components/ContactList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const Avatar = `${import.meta.env.BASE_URL}avatar.png`;

import PinnedIcon from "../assets/pinned.png";
import AllIcon from "../assets/all.png";

function fmtTime(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function pickName(c) {
  const first = String(c.firstName || "").trim();
  const last = String(c.lastName || "").trim();
  const fullFromParts = `${first} ${last}`.trim();
  const fullName = String(c.fullName || "").trim();
  const name = String(c.name || "").trim();
  // Only use username/fullName/first+last, never email/phone
  return fullFromParts || fullName || name || "Unknown";
}

function rowKey(c, idx) {
  return String(c.uid || c.id || c.email || c.phoneNumber || idx);
}

function ContactRow({ c, idx, onSelectContact, onOpenMenu }) {
  const { currentUser } = useAuth ? useAuth() : { currentUser: null };
  const uid = rowKey(c, idx);
  const title = pickName(c);
  const lastTimeMs = c.lastMessageAtMs || c.updatedAtMs || 0;

  // Placeholder: randomly assign online/offline for demo (replace with real presence logic)
  const isOnline = c.isOnline ?? (c.uid ? (c.uid.charCodeAt(0) % 2 === 0) : false);
  // Only show pin icon if contact is pinned
  // (No code change needed here, but logic for pinning is below)
  // Unread logic: if c.unreadCount > 0, show indicator
  const unreadCount = c.unreadCount || 0;
  // Handler to mark as read/unread on click
  const handleUnreadClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const contactId = c.id || c.uid;
    if (!contactId) return;
    try {
      await updateDoc(
        doc(db, "contacts", currentUser.uid, "list", contactId),
        { unreadCount: 0 }
      );
    } catch {}
  };
  // Handler to simulate unread (for demo/testing)
  const handleDateClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    const contactId = c.id || c.uid;
    if (!contactId) return;
    try {
      await updateDoc(
        doc(db, "contacts", currentUser.uid, "list", contactId),
        { unreadCount: 1 }
      );
    } catch {}
  };
  return (
    <div
      onClick={() => onSelectContact?.({ ...c, uid, id: c.id || uid })}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenMenu?.(e.clientX, e.clientY, c);
      }}
      className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-sky-100/80 select-none ${unreadCount > 0 ? "bg-sky-50" : ""}`}
    >
      <div className="relative">
        <img
          src={c.photoURL || Avatar}
          alt={title}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = Avatar;
          }}
        />
        <span
          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-emerald-400" : "bg-gray-400"}`}
          title={isOnline ? "Online" : "Offline"}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-semibold truncate ${unreadCount > 0 ? "text-sky-700" : "text-gray-900"}`}>{title}</h3>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 shrink-0 cursor-pointer" onClick={unreadCount === 0 ? handleDateClick : undefined}>{fmtTime(lastTimeMs)}</span>
            {unreadCount > 0 && (
              <span className="mt-1 bg-sky-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center cursor-pointer" onClick={handleUnreadClick} title="Mark as read">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </div>
        <p className={`text-xs truncate ${unreadCount > 0 ? "text-sky-600 font-semibold" : "text-slate-600"}`}>
          {c.lastMessage ? c.lastMessage : "No messages yet"}
        </p>
      </div>
    </div>
  );
}

export default function ContactList({ contacts = [], onSelectContact, onTogglePin }) {
  const PAGE_SIZE = 20;
  // Only contacts with isPinned === true go in pinnedContacts
  const pinnedContacts = useMemo(
    () =>
      contacts
        .filter((c) => c.isPinned === true)
        .slice()
        .sort(
          (a, b) =>
            (b.updatedAtMs || b.lastMessageAtMs || 0) -
            (a.updatedAtMs || a.lastMessageAtMs || 0)
        ),
    [contacts]
  );

  // ALL section: only contacts with isPinned !== true
  const allUnpinnedSorted = useMemo(
    () =>
      contacts
        .filter((c) => c.isPinned !== true)
        .slice()
        .sort(
          (a, b) =>
            (b.updatedAtMs || b.lastMessageAtMs || 0) -
            (a.updatedAtMs || a.lastMessageAtMs || 0)
        ),
    [contacts]
  );

  const [page, setPage] = useState(1);
  const allUnpinned = useMemo(
    () => allUnpinnedSorted.slice(0, PAGE_SIZE * page),
    [allUnpinnedSorted, page]
  );

  // ✅ WhatsApp/Discord style right-click menu state
  const [menu, setMenu] = useState(null); // {x, y, contact}
  const menuRef = useRef(null);

  const openMenu = (x, y, contact) => {
    const pad = 8;
    const w = 200;
    const h = 56;

    const xx = Math.min(x, window.innerWidth - w - pad);
    const yy = Math.min(y, window.innerHeight - h - pad);

    setMenu({ x: xx, y: yy, contact });
  };

  // close menu on outside click / esc / scroll
  useEffect(() => {
    if (!menu) return;

    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenu(null);
    };
    const onKey = (e) => e.key === "Escape" && setMenu(null);
    const onScroll = () => setMenu(null);

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menu]);

  return (
    <div className="bg-white relative">
      {/* PINNED header (counted) */}
      <div className="px-3 pt-3">
        <div className="rounded-2xl bg-slate-100 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src={PinnedIcon} alt="Pinned" className="w-5 h-5 object-contain" />
            <span className="text-sm font-extrabold tracking-wide text-slate-900">
              PINNED
            </span>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-white shadow-sm text-slate-700">
              {pinnedContacts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned list */}
      <div className="mt-2">
        {pinnedContacts.length === 0 ? (
          <p className="px-4 py-3 text-slate-500 text-sm">No pinned chats yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {pinnedContacts.map((c, idx) => (
              <ContactRow
                key={rowKey(c, idx)}
                c={c}
                idx={idx}
                onSelectContact={onSelectContact}
                onOpenMenu={openMenu}
              />
            ))}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="my-3 px-3">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ALL header (NOT counted) */}
      <div className="px-3">
        <div className="rounded-2xl bg-slate-100 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src={AllIcon} alt="All" className="w-5 h-5 object-contain" />
            <span className="text-sm font-extrabold tracking-wide text-slate-900">ALL</span>
          </div>
        </div>
      </div>

      {/* All list */}
      <div className="mt-2">
        {allUnpinned.length === 0 ? (
          <p className="px-4 py-3 text-slate-500 text-sm">No contacts</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {allUnpinned.map((c, idx) => (
                <ContactRow
                  key={rowKey(c, idx)}
                  c={c}
                  idx={idx}
                  onSelectContact={onSelectContact}
                  onOpenMenu={openMenu}
                />
              ))}
            </div>
            {allUnpinned.length < allUnpinnedSorted.length && (
              <div className="flex justify-center py-3">
                <button
                  className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Context Menu */}
      {menu && (
        <div className="fixed inset-0 z-[9999]" onContextMenu={(e) => e.preventDefault()}>
          <div
            ref={menuRef}
            style={{ left: menu.x, top: menu.y }}
            className="absolute w-[50px] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden mt-3 ml-12"
          >
            <button
              type="button"
              onClick={() => {
                onTogglePin?.(menu.contact);
                setMenu(null);
              }}
              className="w-full px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 flex items-center justify-between"
            >
              {menu.contact?.isPinned ? "" : ""}
              <img src={PinnedIcon} alt="pin" className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
