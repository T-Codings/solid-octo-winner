
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ContactList from "./ContactList";
import ChattiesLogo from "../assets/Chatties.png";
import MingcuteChat from "../assets/mingcutechat.png";
import CreateNewChat from "../assets/Createnewchat.png";
import {SearchIcon} from "lucide-react";


import { doc, updateDoc } from "firebase/firestore";

function Sidebar({ onSelectContact, readContacts = [] }) {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    setError("");
    const ref = collection(db, "contacts", currentUser.uid, "list");
    const unsub = onSnapshot(ref, (snap) => {
      let updated = false;
      const rows = snap.docs.map((d) => {
        const data = { id: d.id, ...d.data() };
        return data;
      });
      setContacts((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(rows)) {
          updated = true;
          return rows;
        }
        return prev;
      });
      if (updated) setLoading(false);
    }, (err) => {
      setError(err?.message || "Failed to load contacts.");
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  // Pin/unpin handler
  const onTogglePin = async (contact) => {
    if (!currentUser || !contact?.id) return;
    try {
      await updateDoc(
        doc(db, "contacts", currentUser.uid, "list", contact.id),
        { isPinned: !contact.isPinned }
      );
    } catch (e) {
      setError("Failed to update pin status.");
    }
  };

  return (
    <div className="w-full md:w-[340px] lg:w-[400px] border-r border-gray-300 h-[320px] md:h-full overflow-y-auto bg-white">
      <div className="pl-1 pr-4 pt-4 pb-4">
        {/* Top logos */}
        <div className="flex items-center gap-2 mb-4">
          <img src={ChattiesLogo} alt="Chatties" className="w-24 h-6 " />
          <img src={MingcuteChat} alt="Mingcute Chat" className="w-8 h-8 object-contain" />
        </div>

        {/* Search bar */}
        <div className="flex items-center mb-2">
          <div className="flex flex-1 items-center bg-white border border-gray-300 rounded-[14px] px-2 py-1">
            <SearchIcon className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search people, contacts..."
              className="flex-1 bg-white outline-none text-lg py-1 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <img src={CreateNewChat} alt="Create New Chat" className="w-7 h-7 object-contain ml-3 cursor-pointer" />
        </div>

        {loading && <div className="text-slate-500">Loading contacts...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ContactList
          contacts={contacts}
          onSelectContact={onSelectContact}
          onTogglePin={onTogglePin}
          readContacts={readContacts}
        />
      </div>
    </div>
  );
}

export default Sidebar;










 