// src/components/ChatArea.jsx
import React, { useEffect, useRef, useState } from "react";
import { addMessageToChat } from "../utils/addMessageToChat";
import { useAuth } from "../context/AuthContext";

export default function ChatArea({ selectedContact }) {
  const { currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const inputRef = useRef(null);

  // focus input when contact changes
  useEffect(() => {
    if (selectedContact) {
      setMessage("");
      inputRef.current?.focus();
    }
  }, [selectedContact]);

  const canSend =
    !!currentUser && !!selectedContact && message.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;

    const text = message.trim();
    setSending(true);

    try {
      await addMessageToChat(currentUser, selectedContact, text);
      setMessage("");
      inputRef.current?.focus();
    } catch (e) {
      console.error("Send failed:", e);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    // Enter to send
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
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
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!selectedContact || sending}
          className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-100"
          placeholder={
            selectedContact ? "Type a message..." : "Select a contact first"
          }
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
