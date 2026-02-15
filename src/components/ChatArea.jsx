// src/components/ChatArea.jsx

import React, { useState } from "react";
import { addMessageToChat } from "../utils/addMessageToChat";
import { useAuth } from "../context/AuthContext";
import ChatAreaHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import useChatMessages from "./useChatMessages";

export default function ChatArea({ selectedContact }) {
  const { currentUser } = useAuth();
  const [sending, setSending] = useState(false);
  const { messages, loading } = useChatMessages(currentUser, selectedContact);

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
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-slate-400 text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-slate-400 text-center">
            {selectedContact.lastMessage ? (
              <>
                <span className="block text-slate-700 font-medium">Last message:</span>
                <span>{selectedContact.lastMessage}</span>
              </>
            ) : (
              "No messages yet."
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] px-4 py-2 rounded-xl shadow text-sm mb-1 ${msg.senderId === currentUser.uid ? "bg-emerald-100 ml-auto text-right" : "bg-white text-left"}`}
            >
              {msg.text}
              <div className="text-xs text-slate-400 mt-1">
                {msg.createdAtMs ? new Date(msg.createdAtMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </div>
            </div>
          ))
        )}
      </div>
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
