// src/components/ContactList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

import PinnedIcon from "../assets/pinned.png";
import AllIcon from "../assets/all.png";

const Avatar = `${import.meta.env.BASE_URL}avatar.png`;

function fmtTime(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

// ✅ no "User/Unknown"
function displayNameOf(c) {
  const full = String(c?.fullName || "").trim();
  if (full) return full;

  const first = String(c?.firstName || "").trim();
  const last = String(c?.lastName || "").trim();
  const composed = `${first} ${last}`.trim();
  if (composed) return composed;

  // allowed fallback (still a real identifier)
  const contact = String(c?.contact || "").trim();
  if (contact) return contact;

  return "";
}

function contactUidOf(c, idx) {
  // ✅ stable + correct: use uid/id only
  return String(c?.uid || c?.id || idx);
}

function normalizeContact(c, idx) {
  const uid = c?.uid || c?.id || contactUidOf(c, idx);
  return { ...c, uid, id: c?.id || uid };
}

function ContactRow({ c, idx, onSelectContact, onOpenMenu, selected }) {
  const { currentUser } = useAuth();
  const contact = normalizeContact(c, idx);
  const uid = contact.uid;

  const title = displayNameOf(contact);
  const avatar = contact.photoURL || Avatar;

  const lastTimeMs = contact.lastMessageAtMs || contact.updatedAtMs || 0;
  const unreadCount = Number(contact.unreadCount || 0);

  const isOnline = Boolean(contact.isOnline);

  const handleUnreadClick = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "contacts", currentUser.uid, "list", uid), { unreadCount: 0 });
    } catch {}
  };

  return (
    <div
      onClick={() => onSelectContact?.(contact)}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenMenu?.(e.clientX, e.clientY, contact);
      }}
      className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-emerald-100 select-none rounded-xl mb-1 ${
        unreadCount > 0 ? "bg-emerald-50" : "bg-white"
      } ${selected ? "ring-2 ring-emerald-400 bg-emerald-50" : ""}`}
    >
      <div className="relative">
        <img
          src={avatar}
          alt={title || ""}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            if (e.currentTarget.dataset.fallbackApplied) return;
            e.currentTarget.dataset.fallbackApplied = "1";
            e.currentTarget.src = Avatar;
          }}
        />
        <span
          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? "bg-emerald-400" : "bg-gray-400"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-semibold truncate ${unreadCount > 0 ? "text-sky-700" : "text-gray-900"}`}>
            {title || "\u00A0"}
          </h3>

          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 shrink-0">{fmtTime(lastTimeMs)}</span>

            {unreadCount > 0 && (
              <span
                className="mt-1 bg-sky-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center cursor-pointer"
                onClick={handleUnreadClick}
                title="Mark as read"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs truncate ${unreadCount > 0 ? "text-sky-600 font-semibold" : "text-slate-600"}`}>
          {contact.lastMessage ? contact.lastMessage : "No messages yet"}
        </p>
      </div>
    </div>
  );
}

export default function ContactList({
  contacts = [],
  onSelectContact,
  onTogglePin,
  readContacts = [],
  selectedContactId,
}) {
  const PAGE_SIZE = 20;

  const pinnedContacts = useMemo(
    () =>
      contacts
        .filter((c) => c.isPinned === true)
        .slice()
        .sort(
          (a, b) =>
            (b.updatedAtMs || b.lastMessageAtMs || 0) - (a.updatedAtMs || a.lastMessageAtMs || 0)
        ),
    [contacts]
  );

  const allUnpinnedSorted = useMemo(
    () =>
      contacts
        .filter((c) => c.isPinned !== true)
        .slice()
        .sort(
          (a, b) =>
            (b.updatedAtMs || b.lastMessageAtMs || 0) - (a.updatedAtMs || a.lastMessageAtMs || 0)
        ),
    [contacts]
  );

  const [page, setPage] = useState(1);
  const allUnpinned = useMemo(() => allUnpinnedSorted.slice(0, PAGE_SIZE * page), [allUnpinnedSorted, page]);

  const [search, setSearch] = useState("");

  // ✅ filter uses displayName (never Unknown)
  const filteredPinned = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pinnedContacts;
    return pinnedContacts.filter((c) => displayNameOf(c).toLowerCase().includes(q));
  }, [pinnedContacts, search]);

  const filteredAll = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allUnpinned;
    return allUnpinned.filter((c) => displayNameOf(c).toLowerCase().includes(q));
  }, [allUnpinned, search]);

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
    <div className="bg-slate-50 min-h-screen w-full max-w-xs flex flex-col shadow-lg rounded-r-xl border-r border-slate-200">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* PINNED header */}
      <div className="px-3 pt-3">
        <div className="rounded-2xl bg-slate-100 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src={PinnedIcon} alt="Pinned" className="w-5 h-5 object-contain" />
            <span className="text-sm font-extrabold tracking-wide text-slate-900">PINNED</span>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full bg-white shadow-sm text-slate-700">
              {filteredPinned.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pinned list */}
      <div className="mt-2">
        {filteredPinned.length === 0 ? (
          <p className="px-4 py-3 text-slate-500 text-sm">No pinned chats yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPinned.map((c, idx) => (
              <ContactRow
                key={contactUidOf(c, idx)}
                c={c}
                idx={idx}
                onSelectContact={onSelectContact}
                onOpenMenu={openMenu}
                selected={selectedContactId === (c.id || c.uid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="my-3 px-3">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ALL header */}
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
        {filteredAll.length === 0 ? (
          <p className="px-4 py-3 text-slate-500 text-sm">No contacts</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {filteredAll.map((c, idx) => (
                <ContactRow
                  key={contactUidOf(c, idx)}
                  c={c}
                  idx={idx}
                  onSelectContact={onSelectContact}
                  onOpenMenu={openMenu}
                  selected={selectedContactId === (c.id || c.uid)}
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

      {/* Context Menu (pin) */}
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
              <img src={PinnedIcon} alt="pin" className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
