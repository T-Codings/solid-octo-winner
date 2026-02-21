

import React, { useState, useRef, useEffect } from "react";
import sentSound from "../assets/sent.mp3";
import receivedSound from "../assets/received.mp3";
import AllIcon from "../assets/all.png";
import ForwardIcon from "../assets/forward.png";
import MoreIcon from "../assets/more.png";

export default function ChatArea({ selectedContact, onReadContact }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, msg: null });
  const [forwardModal, setForwardModal] = useState({ open: false, msg: null });
  const [pinnedMsgIds, setPinnedMsgIds] = useState([]);
  const [unreadMsgIds, setUnreadMsgIds] = useState([]);
  const [forwardSelected, setForwardSelected] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const chatAreaRef = useRef(null);
  const currentUser = useRef(null);

  useEffect(() => {
    // Initialize current user
    currentUser.current = "user123"; // Replace with actual logic to get current user
    // Load messages for the selected contact
    setMessages([]);
    setLoading(true);
  }, [selectedContact]);

  const handleSend = async (text) => {
    setSending(true);
    await addMessageToChat(currentUser.current, selectedContact, text);
    setSending(false);
  };

  const handleMenuAction = (action, msg) => {
    switch (action) {
      case "pin":
        setPinnedMsgIds((prev) => {
          if (prev.includes(msg.id)) {
            return prev.filter(id => id !== msg.id);
          }
          return [...prev, msg.id];
        });
        break;
      case "copy":
        navigator.clipboard.writeText(msg.text);
        break;
      case "reply":
        setMenu({ visible: true, x: 0, y: 0, msg });
        break;
      case "forward":
        setForwardModal({ open: true, msg });
        break;
      case "other":
        setMenu({ visible: true, x: 0, y: 0, msg });
        break;
      case "edit":
        setMenu({ visible: true, x: 0, y: 0, msg });
        break;
      case "delete":
        setMenu({ visible: true, x: 0, y: 0, msg });
        break;
      case "react":
        setMenu({ visible: true, x: 0, y: 0, msg });
        break;
      case "unread":
        setUnreadMsgIds((prev) => {
          if (prev.includes(msg.id)) {
            return prev.filter(id => id !== msg.id);
          }
          return [...prev, msg.id];
        });
        break;
      case "select":
        setMultiSelectMode(true);
        break;
      case "exit-multiselect":
        setMultiSelectMode(false);
        break;
    }
  };

  // Removed duplicate setForwardSelected declaration. Use the setter from useState directly.

  useEffect(() => {
    if (forwardModal.open) {
      setForwardSelected([]);
    }
  }, [forwardModal.open]);

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
    <div className="flex flex-col h-full" ref={chatAreaRef}>
      <div className="sticky top-0 z-10 bg-white">
        <ChatHeader contact={selectedContact} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
        {loading ? (
          <div className="text-slate-400 text-center">Loading messages...</div>
        ) : messages.length === 0 ? (
          null
        ) : (
          <>
            {/* Pinned messages section */}
            {pinnedMsgIds.length > 0 && (
              <div className="mb-4 rounded-lg p-2">
                {/* ...existing pinned messages code... */}
              </div>
            )}
            {/* Regular (unpinned) messages */}
            {messages.filter(msg => !pinnedMsgIds.includes(msg.id)).map((msg, idx) => {
              // ...existing message rendering code...
            })}
            {/* Popup menu */}
            {menu.visible && (
              <div className="absolute bg-white border border-gray-200 rounded-lg py-2 px-0 min-w-[160px]" style={{ left: menu.x, top: menu.y, background: '#fff', boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)' }}>
                {pinnedMsgIds.includes(menu.msg.id) && (
                  <button className=" text-left px-4 py-2 bg-white text-red-600 " onClick={() => handleMenuAction("pin", menu.msg)}>Unpin</button>
                )}
                {!pinnedMsgIds.includes(menu.msg.id) && (
                  <>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("copy", menu.msg)}><span>Copy</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("reply", menu.msg)}><span>Reply</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("forward", menu.msg)}><img src={ForwardIcon} alt="Forward" className="w-4 h-4" /><span>Forward</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("other", menu.msg)}><img src={MoreIcon} alt="Other" className="w-4 h-4" /><span>Other</span></button>
                    {menu.msg.senderId === currentUser.current && (
                      <>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("edit", menu.msg)}>Edit</button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("delete", menu.msg)}>Delete</button>
                      </>
                    )}
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("pin", menu.msg)}>Pin message</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("react", menu.msg)}>React with emoji</button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("unread", menu.msg)}>{unreadMsgIds.includes(menu.msg.id) ? "Mark as read" : "Mark as unread"}</button>
                    {!multiSelectMode && (
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("select", menu.msg)}>Select multiple</button>
                    )}
                    {multiSelectMode && (
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={() => handleMenuAction("exit-multiselect")}>Exit multi-select</button>
                    )}
                  </>
                )}
              </div>
            )}
            {/* Forward Modal */}
            {forwardModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><img src={ForwardIcon} alt="Forward" className="w-5 h-5" /> Forward message</h2>
                  <div className="max-h-64 overflow-y-auto mb-4">
                    {contacts.length === 0 ? (
                      <div className="text-slate-500 text-center">Loading contacts...</div>
                    ) : (
                      <ul>
                        {contacts.map((c) => (
                          <li key={c.id} className="flex items-center gap-2 py-2 px-2 hover:bg-slate-100 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={forwardSelected.includes(c.id)}
                              onChange={() => setForwardSelected((sel) => sel.includes(c.id) ? sel.filter(id => id !== c.id) : [...sel, c.id])}
                            />
                            <img src={c.photoURL || AllIcon} alt={c.fullName || c.name || c.id} className="w-8 h-8 rounded-full object-cover border" />
                            <span className="truncate flex-1">{c.fullName || c.name || c.id}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setForwardModal({ open: false, msg: null })}>Cancel</button>
                    <button
                      className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold disabled:opacity-50"
                      disabled={forwardSelected.length === 0}
                      onClick={async () => {
                        if (!currentUser.current || !forwardModal.msg) return;
                        for (const id of forwardSelected) {
                          const c = contacts.find(x => x.id === id);
                          if (c) await addMessageToChat(currentUser.current, c, forwardModal.msg.text);
                        }
                        setForwardModal({ open: false, msg: null });
                        setForwardSelected([]);
                      }}
                    >
                      Forward
                    </button>
                  </div>
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setForwardModal({ open: false, msg: null })}>&times;</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Typing indicator */}
      {otherTyping && (
        <div className="px-4 pb-2 text-xs text-emerald-500 animate-pulse">{selectedContact.firstName || selectedContact.fullName || selectedContact.name || "Contact"} is typing...</div>
      )}
      <MessageInput onSend={handleSend} disabled={sending} selectedContact={selectedContact} currentUser={currentUser} />
      {/* Audio elements for sounds */}
      <audio ref={sentAudio} src={sentSound} preload="auto" />
      <audio ref={receivedAudio} src={receivedSound} preload="auto" />
    </div>
  );
}







