import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Correct path
import ChatArea from "./ChatArea"; // Correct path

function ChatApp() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [typingUser, setTypingUser] = useState("");

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar with contact selection */}
      <Sidebar onSelectContact={setSelectedContact} />

      {/* Chat area for selected contact */}
      <div className="flex-1 min-w-0">
        <ChatArea selectedContact={selectedContact} setTypingUser={setTypingUser} />
      </div>
    </div>
  );
}

export default ChatApp;
