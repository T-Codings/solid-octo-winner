// src/components/ContactsList.jsx
import React from "react";

function Contacts({ contacts, onSelectContact }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {contacts.map((contact) => (
        <div
          key={contact.uid}
          onClick={() => onSelectContact(contact)}
          className="flex items-center p-3 cursor-pointer hover:bg-gray-100 transition"
        >
          <img
            src={contact.photoURL || "src/assets/default-profile.png"}
            alt={contact.fullName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="text-sm font-semibold">{contact.fullName}</h3>
            <p className="text-xs text-gray-500 truncate">
              {contact.lastMessage || "No messages yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Contacts;
