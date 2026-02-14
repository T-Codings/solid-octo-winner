
// src/components/ContactList.jsx
import React from "react";

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

  const email = String(c.email || "").trim();
  const emailName = email.includes("@") ? email.split("@")[0] : "";

  const phone = String(c.phoneNumber || "").trim();

  return fullFromParts || fullName || name || emailName || email || phone || "Unknown";
}

function rowKey(c, idx) {
  return String(c.uid || c.id || c.email || c.phoneNumber || idx);
}

function ContactRow({ c, idx, onSelectContact, onTogglePin }) {
  const uid = rowKey(c, idx);
  const title = pickName(c);
  const lastTimeMs = c.lastMessageAtMs || c.updatedAtMs || 0;

  return (
    <div
      onClick={() => onSelectContact?.({ ...c, uid, id: c.id || uid })}
      className="flex items-center gap-3 p-3 cursor-pointer transition hover:bg-cyan-100/80"
    >
      <img
        src={c.photoURL || Avatar}
        alt={title}
        className="w-12 h-12 rounded-full object-cover border border-black/10"
        onError={(e) => {
          if (e.currentTarget.dataset.fallbackApplied) return;
          e.currentTarget.dataset.fallbackApplied = "1";
          e.currentTarget.src = Avatar;
        }}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
            {c.isPinned && (
              <img
                src={PinnedIcon}
                alt="Pinned"
                className="w-4 h-4 object-contain opacity-80 shrink-0"
                title="Pinned"
              />
            )}
          </div>

          <span className="text-xs text-slate-500 shrink-0">{fmtTime(lastTimeMs)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-600 truncate">
            {c.lastMessage ? c.lastMessage : "No messages yet"}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.(c);
            }}
            className="shrink-0 w-8 h-8 rounded-lg hover:bg-white/70 transition flex items-center justify-center"
            title={c.isPinned ? "Unpin" : "Pin"}
          >
            <img
              src={PinnedIcon}
              alt="pin"
              className={`w-4 h-4 object-contain ${c.isPinned ? "opacity-100" : "opacity-40"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactList({ contacts = [], onSelectContact, onTogglePin }) {
  const pinnedContacts = contacts
    .filter((c) => !!c.isPinned)
    .slice()
    .sort((a, b) => (b.updatedAtMs || b.lastMessageAtMs || 0) - (a.updatedAtMs || a.lastMessageAtMs || 0));

  const allUnpinned = contacts
    .filter((c) => !c.isPinned)
    .slice()
    .sort((a, b) => (b.updatedAtMs || b.lastMessageAtMs || 0) - (a.updatedAtMs || a.lastMessageAtMs || 0));

  return (
    <div className="bg-white">
      {/* PINNED header (counted) */}
      <div className="px-3 pt-3">
        <div className="rounded-2xl bg-slate-100 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <img src={PinnedIcon} alt="Pinned" className="w-5 h-5 object-contain" />
            <span className="text-sm font-extrabold tracking-wide text-slate-900">PINNED</span>
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
                onTogglePin={onTogglePin}
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
          <div className="divide-y divide-gray-200">
            {allUnpinned.map((c, idx) => (
              <ContactRow
                key={rowKey(c, idx)}
                c={c}
                idx={idx}
                onSelectContact={onSelectContact}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
