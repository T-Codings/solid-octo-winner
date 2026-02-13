import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import ContactList from "./ContactList";

function Sidebar({ onSelectContact }) {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    setLoadingContacts(true);
    setError("");

    // ✅ Correct path: contacts/{uid}/list/{contactUid}
    const ref = collection(db, "contacts", currentUser.uid, "list");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // ✅ safe sort (newest first)
        rows.sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));

        setContacts(rows);
        setLoadingContacts(false);
      },
      (err) => {
        setError(err?.message || "Failed to load contacts.");
        setLoadingContacts(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  return (
    <div className="w-80 border-r border-white/10 h-screen overflow-y-auto bg-slate-950/20 backdrop-blur">
      <h2 className="p-4 text-xl font-extrabold border-b border-white/10 bg-slate-950/30 text-white">
        Contacts
      </h2>

      {loadingContacts && (
        <p className="p-4 text-slate-300 text-center">Loading...</p>
      )}

      {!loadingContacts && error && (
        <p className="p-4 text-red-200 text-center">{error}</p>
      )}

      {!loadingContacts && !error && contacts.length === 0 && (
        <p className="p-4 text-slate-300 text-center">No contacts found</p>
      )}

      <ContactList contacts={contacts} onSelectContact={onSelectContact} />
    </div>
  );
}

export default Sidebar;
