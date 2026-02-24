
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useNavigate } from "react-router-dom";
import { GitCommit } from "lucide-react";

function ChatApp() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [typingUser, setTypingUser] = useState("");
  const navigate = useNavigate();

  // When a contact is selected, navigate to /chat/:contactId
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    const contactId = contact?.id || contact?.uid;
    if (contactId) {
      navigate(`/chat/${contactId}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar with contact selection */}
      <Sidebar onSelectContact={handleSelectContact} />

      {/* Chat area for selected contact */}
      <div className="flex-1 min-w-0">
        <ChatArea selectedContact={selectedContact} setTypingUser={setTypingUser} />
      </div>
    </div>
  );
}

export default ChatApp;








