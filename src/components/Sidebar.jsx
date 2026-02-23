
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ContactList from "./ContactList";

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
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setContacts(rows);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Failed to load contacts.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, [currentUser]);

  return (
    <div className="w-[340px] border-r border-gray-300 h-screen overflow-y-auto bg-white">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Contacts</h2>
        {loading && <div>Loading contacts...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ContactList
          contacts={contacts}
          onSelectContact={onSelectContact}
          readContacts={readContacts}
        />
      </div>
    </div>
  );
}

export default Sidebar;
