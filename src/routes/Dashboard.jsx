
// src/routes/Dashboard.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

function Dashboard() {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectContact={setSelectedContact} />
      <div className="flex-1 bg-gray-50">
        {selectedContact ? (
          <ChatArea contact={selectedContact} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
