import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Correct path
import ChatArea from "./ChatArea"; // Correct path

function ChatApp() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [typingUser, setTypingUser] = useState("");

  return (
    <div className="flex h-screen">
      {/* Sidebar with contact selection */}
      <Sidebar onSelectContact={setSelectedContact} />

      {/* Chat area for selected contact */}
      <ChatArea contact={selectedContact} setTypingUser={setTypingUser} />
    </div>
  );
}

export default ChatApp;
