// src/components/ContactList.jsx
import React from "react";
import DefaultAvatar from "../assets/default-profile.png"; // make sure this exists

function fmtTime(ms) {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ContactList({ contacts = [], onSelectContact }) {
  return (
    <div className="divide-y divide-white/10">
      {contacts.map((c) => {
        const uid = c.uid || c.id;
        const name = c.fullName || c.name || "Unknown";
        const lastTimeMs = c.lastMessageAtMs || c.updatedAtMs || 0;

        return (
          <div
            key={uid}
            onClick={() => onSelectContact?.({ ...c, uid, id: c.id || uid })}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition"
          >
            <img
              src={c.photoURL || DefaultAvatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white truncate">
                  {name}
                </h3>
                <span className="text-xs text-slate-300 shrink-0">
                  {fmtTime(lastTimeMs)}
                </span>
              </div>

              <p className="text-xs text-slate-300 truncate">
                {c.lastMessage ? c.lastMessage : "No messages yet"}
              </p>
            </div>
          </div>
        );
      })}

      {contacts.length === 0 && (
        <p className="p-4 text-slate-300 text-center">No contacts</p>
      )}
    </div>
  );
}
