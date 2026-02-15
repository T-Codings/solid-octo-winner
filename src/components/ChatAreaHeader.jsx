
import React from "react";
import avatarImg from "../assets/avatar.png";

export default function ChatAreaHeader({ contact }) {
  if (!contact) return null;
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <img
        src={contact.photoURL || avatarImg}
        alt={contact.fullName || contact.name || "Contact"}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
      <div className="min-w-0">
        <div className="font-semibold text-gray-900 truncate">
          {contact.fullName || contact.name || contact.email || "Unknown"}
        </div>
        {contact.email && (
          <div className="text-xs text-gray-500 truncate">{contact.email}</div>
        )}
      </div>
    </div>
  );
}
