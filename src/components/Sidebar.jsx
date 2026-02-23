// src/components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ContactList from "./ContactList";
import { useNavigate } from "react-router-dom";

import MingcuteChat from "../assets/mingcutechat.png";
import Chatties from "../assets/Chatties.png";
import CreateNewChat from "../assets/Createnewchat.png";
import { Search } from "lucide-react";

function Sidebar({ onSelectContact, onContactsLoaded, readContacts = [] }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setLoadingContacts(true);
    setError("");

    const ref = collection(db, "contacts", currentUser.uid, "list");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        rows.sort((a, b) => {
          const pinA = a.isPinned ? 1 : 0;
          const pinB = b.isPinned ? 1 : 0;
          if (pinB !== pinA) return pinB - pinA;
          return (
            (b.updatedAtMs || b.lastMessageAtMs || 0) -
            (a.updatedAtMs || a.lastMessageAtMs || 0)
          );
        });

        setContacts(rows);
        setLoadingContacts(false);

        // ✅ send contacts up to ChatApp for forward modal
        onContactsLoaded?.(rows);
      },
      (err) => {
        setError(err?.message || "Failed to load contacts.");
        setLoadingContacts(false);
      }
    );

    return () => unsub();
  }, [currentUser, onContactsLoaded]);

  const filteredContacts = useMemo(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return contacts;

    return contacts.filter((c) => {
      const name = (
        c.fullName ||
        `${c.firstName || ""} ${c.lastName || ""}` ||
        c.contact ||
        c.email ||
        ""
      )
        .trim()
        .toLowerCase();

      const email = String(c.email || "").toLowerCase();
      const phone = String(c.phoneNumber || c.contact || "").toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [contacts, query]);

  // ✅ When a contact is clicked
  const handleSelectContact = (c) => {
    if (!c) return;

    const uid = c.uid || c.id; // doc id is usually uid
    const normalized = { ...c, uid, id: c.id || uid };

    // ✅ pass selected contact up to ChatApp (important!)
    onSelectContact?.(normalized);

    // Optional: if you still want URL to change:
    // navigate(`/chat/${uid}`);
  };

  const handleTogglePin = async (c) => {
    if (!currentUser) return;
    const contactId = c.id || c.uid;
    if (!contactId) return;

    try {
      await updateDoc(doc(db, "contacts", currentUser.uid, "list", contactId), {
        isPinned: !c.isPinned,
      });
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  return (
    <div className="w-[340px] border-r border-gray-300 h-screen overflow-y-auto bg-white">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <img
            src={Chatties}
            alt="ChatApp"
            className="w-[100px] h-10 object-contain"
          />
          <img
            src={MingcuteChat}
            alt="ChatApp icon"
            className="w-10 h-7 object-contain"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts, people..."
              className="w-full h-10 pl-10 pr-3 rounded-xl bg-white border border-gray-300 text-gray-800
                         placeholder:text-slate-500 placeholder:font-medium outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <button
            type="button"
            className="shrink-0 w-10 h-10 rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
            title="Create new chat"
            onClick={() => console.log("Create new chat clicked")}
          >
            <img
              src={CreateNewChat}
              alt="Create new chat"
              className="w-7 h-7 object-contain"
            />
          </button>
        </div>
      </div>

      {loadingContacts && (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="w-8 h-8 mb-2 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sky-600 font-semibold text-base">
            Loading contacts...
          </span>
        </div>
      )}

      {!loadingContacts && error && (
        <p className="p-4 text-red-600 text-center">{error}</p>
      )}

      <ContactList
        contacts={filteredContacts}
        onSelectContact={handleSelectContact}
        onTogglePin={handleTogglePin}
        readContacts={readContacts}
      />
    </div>
  );
}

export default Sidebar;
