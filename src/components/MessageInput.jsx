

import React, { useState, useRef } from "react";
import telegramIcon from "../assets/telegram.png";
import voiceIcon from "../assets/iconparksolidvoice.png";
import attachIcon from "../assets/akar.png";

export default function MessageInput({ onSend, disabled }) {
  const emojiList = [
    "😀", "😁", "😂", "🤣", "😊", "😍", "😎", "😢", "😡", "👍", "🙏", "🎉", "❤️", "🔥", "🥳",
    "😃", "😄", "😅", "😆", "😉", "😋", "😜", "🤪", "🤩", "🥰", "😘", "😗", "😙", "😚", "😇",
    "🤗", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫",
    "😴", "😌", "😛", "😝", "😤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖",
    "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶",
    "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺",
    "💩", "😺", "😸", "😹", "🐶", "🐱", "🐭", "🐹", "🐰",
    "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔",
    "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", 
    "🐎", "🐖", "🐄", "🐂", "🐃", "🐅", "🐆", "🦌", "🐇", "🦝", "🦡", 
  ];
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setMessage((msg) => msg + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

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
    <div className="flex gap-2 p-2 border-t bg-white items-center">
      <div className="relative flex-1 flex items-center">
        {/* Emoji button at start */}
        <button
          type="button"
          className=" text-2xl focus:outline-none bg-transparent border-none"
          onClick={() => setShowEmojiPicker((v) => !v)}
          tabIndex={-1}
        >
          😀
        </button>
        {/* Emoji picker popup */}
        {showEmojiPicker && (
          <div className="absolute  left-0 bottom-14 bg-white border border-gray-200 rounded-xl  shadow-lg p-2 z-50 flex flex-wrap gap-2 w-[1150px]">
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                className="text-2xl p-1 hover:bg-gray-100 rounded"
                onClick={() => handleEmojiSelect(emoji)}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className="w-full border border-gray-400 h-12 rounded-xl pl-4 pr-20 py-2 outline-none focus:ring-1 focus:ring-emerald-400 disabled:bg-gray-100"
          placeholder={disabled ? "Select a contact first" : "Type a message..."}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 items-center">
          <img src={voiceIcon} alt="Voice" className="w-6 h-6 opacity-70" />
          <img src={attachIcon} alt="Attach" className="w-6 h-6 opacity-70" />
        </div>
      </div>
      <button
        onClick={handleSend}
        
        className="px-4 py-2 rounded-lg bg-sky-400 text-[16px] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Send"
      > Send
        <img src={telegramIcon} alt="Send" className="w-5 h-5" />
      </button>
    </div>
  );
}
