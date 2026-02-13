// src/components/ChatArea.jsx
import React, { useState } from "react";
import { addMessageToChat } from "../utils/addMessageToChat"; // ✅ correct path
import { useAuth } from "../context/AuthContext"; // adjust if your path differs

export default function ChatArea({ selectedContact }) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!currentUser || !selectedContact) return;

    const text = message.trim();
    if (!text) return;

    try {
      await addMessageToChat(currentUser, selectedContact, text);
      setMessage("");
    } catch (e) {
      console.error("Send failed:", e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area (keep your own UI here) */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* render messages here */}
      </div>

      {/* Input area (simple example) */}
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-green-600 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}




