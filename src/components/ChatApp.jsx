// src/components/ChatApp.jsx
import React from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

function ChatApp() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <ChatArea selectedContact={null} />
      </div>
    </div>
  );
}

export default ChatApp;

