// src/components/ChatArea.jsx
import React, { useEffect, useRef, useState } from "react";

import { addMessageToChat } from "../utils/addMessageToChat";
import { useAuth } from "../context/AuthContext";
import ChatAreaHeader from "./ChatAreaHeader";
import MessageInput from "./MessageInput";

export default function ChatArea({ selectedContact }) {
  const { currentUser } = useAuth();
  const [sending, setSending] = useState(false);

  const handleSend = async (text) => {
    if (!currentUser || !selectedContact || !text.trim() || sending) return;
    setSending(true);
    try {
      await addMessageToChat(currentUser, selectedContact, text.trim());
    } catch (e) {
      console.error("Send failed:", e);
    } finally {
      setSending(false);
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Select a contact to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatAreaHeader contact={selectedContact} />
      <div className="flex-1 overflow-y-auto p-4">
        {/* render messages here */}
      </div>
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
