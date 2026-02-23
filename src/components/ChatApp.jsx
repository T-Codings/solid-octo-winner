// src/components/ChatApp.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useAuth } from "../context/AuthContext";

function ChatApp() {
  const { currentUser, userData } = useAuth();

  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);

  return (
    <div className="flex h-screen">
      <Sidebar
        onSelectContact={(c) => setSelectedContact(c)}
        onContactsLoaded={(list) => setContacts(list)}
      />

      <div className="flex-1">
        <ChatArea
          selectedContact={selectedContact}
          currentUser={currentUser}
          myProfile={userData}
          contacts={contacts}
        />
      </div>
    </div>
  );
}

export default ChatApp;

