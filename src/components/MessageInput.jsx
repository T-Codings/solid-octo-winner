import React, { useState, useRef } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-2 border-t bg-white">
      <input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-400 disabled:bg-gray-100"
        placeholder={disabled ? "Select a contact first" : "Type a message..."}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
