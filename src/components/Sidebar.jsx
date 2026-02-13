import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

function Sidebar({ onSelectContact }) {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    {
      contact.lastMessage && (
        <div className="text-sm text-gray-600 truncate">
          {contact.lastMessage}
        </div>
      );
    }

    const q = query(collection(db, "sidebarContacts"));

    const unsub = onSnapshot(q, (snapshot) => {
      let list = [];

      snapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          list.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });

      list.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return b.lastMessageTime.seconds - a.lastMessageTime.seconds;
      });

      setContacts(list);
    });

    return () => unsub();
  }, [currentUser]);

  return (
    <div className="w-80 border-r border-gray-300 h-screen overflow-y-auto bg-white">
      <h2 className="p-4 text-xl font-semibold border-b bg-indigo-600 text-white">
        Contacts
      </h2>

      {contacts.length === 0 && (
        <p className="p-4 text-gray-500 text-center">No contacts found</p>
      )}

      <div>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
          >
            <img
              src={contact.photoURL ? contact.photoURL : "/default-avatar.png"}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover border"
            />

            <div className="ml-3 w-full">
              <div className="text-lg font-semibold">{contact.name}</div>

              {/* Show last message ONLY if it exists */}
              {contact.lastMessage && (
                <div className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </div>
              )}

              {/* Last Message Time */}
              {contact.lastMessageTime && (
                <div className="text-xs text-gray-400">
                  {new Date(
                    contact.lastMessageTime.seconds * 1000
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
