// src/components/ContactsList.jsx
import React from "react";


function ContactList({ contacts = [], onSelectContact }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {contacts.map((contact) => {
        const uid = contact.uid || contact.id;
        const name = contact.fullName || contact.name || "Unknown";

        return (
          <div
            key={uid}
            onClick={() => onSelectContact?.({ ...contact, uid })}
            className="flex items-center p-3 cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              src={contact.photoURL || DefaultAvatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />

            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate">{name}</h3>
              <p className="text-xs text-gray-500 truncate">
                {contact.lastMessage || "No messages yet"}
              </p>
            </div>
          </div>
        );
      })}

      {contacts.length === 0 && (
        <p className="p-4 text-gray-500 text-center">No contacts</p>
      )}
    </div>
  );
}

export default ContactList;

