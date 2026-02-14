// src/components/ChatArea.jsx

import React, { useEffect, useRef, useState } from "react";
import { addMessageToChat } from "../utils/addMessageToChat";
import { useAuth } from "../context/AuthContext";
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ✅ Chat header */}
      <div className="h-14 border-b border-gray-200 px-4 flex items-center">
        {selectedContact ? (
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-gray-900 truncate">
              {selectedContact.fullName ||
                selectedContact.name ||
                `${selectedContact.firstName || ""} ${
                  selectedContact.lastName || ""
                }`.trim() ||
                selectedContact.email ||
                "Chat"}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {selectedContact.email || selectedContact.phoneNumber || ""}
            </div>
          </div>
        ) : (
          <div className="text-sm font-semibold text-slate-500">
            Select a contact to start chatting
          </div>
        )}
      </div>

      {/* Messages area (you will render messages here later) */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedContact ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            No chat selected
          </div>
        ) : (
          <div className="text-slate-500 text-sm">
            {/* Render messages here */}
          </div>
        )}
      </div>

      {/* ✅ Input area */}
      <MessageInput onSend={handleSend} disabled={!selectedContact || sending} />
    </div>
  );
}
