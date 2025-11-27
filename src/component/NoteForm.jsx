// Home.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { MessageCircle, Plus, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // ---------- REAL-TIME CONTACTS FETCH ----------
  useEffect(() => {
    const q = query(
      collection(db, "contacts"),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContacts(data);
    });

    return () => unsubscribe();
  }, []);

  // ---------- SEARCH FILTER ----------
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- DARK MODE ----------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ---------- OPEN CHAT ----------
  const openChat = (contact) => {
    navigate("/chat", { state: { contact } });
  };

  return (
    <div
      className={`min-h-screen p-4 transition ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* ========= HEADER ========= */}
      <header
        className={`flex items-center justify-between p-4 mb-4 rounded-lg shadow 
          ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Chats
        </h1>

        <div className="flex items-center gap-4">
          {/* Light/Dark Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-600" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <MessageCircle className="text-indigo-600 h-6 w-6" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {currentUser?.email}
            </span>
          </div>
        </div>
      </header>

      {/* ========= SEARCH BAR ========= */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 
            dark:bg-gray-800 dark:text-white dark:border-gray-600
            focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* ========= CONTACT LIST ========= */}
      <div
        className={`rounded-lg shadow p-2 
        ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {filteredContacts.length === 0 && (
          <p className="text-center py-6 text-gray-500 dark:text-gray-300">
            No contacts found.
          </p>
        )}

        {filteredContacts.map((c) => (
          <div
            key={c.id}
            onClick={() => openChat(c)}
            className={`flex items-center gap-4 p-3 mb-1 rounded-lg cursor-pointer transition 
              hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={c.image}
                alt={c.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Online Dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 
                  ${
                    c.online
                      ? "bg-green-500 border-white"
                      : "bg-gray-400 border-gray-200"
                  }`}
              ></span>
            </div>

            {/* Contact Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {c.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                {c.typing ? (
                  <span className="text-indigo-400 animate-pulse">
                    Typing...
                  </span>
                ) : (
                  c.lastMessage
                )}
              </p>
            </div>

            {/* Time + Unread */}
            <div className="text-right">
              <p className="text-xs text-gray-400 dark:text-gray-300">
                {c.lastMessageTime}
              </p>

              {c.unread > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {c.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ========= FLOATING NEW CHAT BUTTON ========= */}
      <button
        onClick={() => navigate("/new-chat")}
        className="fixed bottom-6 right-6 bg-indigo-600 p-4 rounded-full shadow-lg 
        hover:bg-indigo-700 transition active:scale-95"
      >
        <Plus className="text-white w-6 h-6" />
      </button>
    </div>
  );
}

export default Home;
