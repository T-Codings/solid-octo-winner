// src/components/ChatArea.jsx
import React, { useMemo, useRef, useState } from "react";
import sentSound from "../assets/sent.mp3";
import receivedSound from "../assets/received.mp3";
import AllIcon from "../assets/all.png";

// make sure these exist in your project:
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

// if you use these icons, import them (or remove the buttons that use them)
import ForwardIcon from "../assets/forward.jpg";
import MoreIcon from "../assets/more.png"; // fixed import
import ReplyIcon from "../assets/reply.png"; // added reply icon

function displayNameOf(p) {
  const full = String(p?.fullName || "").trim();
  if (full) return full;

  const first = String(p?.firstName || "").trim();
  const last = String(p?.lastName || "").trim();
  const composed = `${first} ${last}`.trim();
  if (composed) return composed;

  // allowed fallbacks (NOT "User"/"Unknown")
  const contact = String(p?.contact || "").trim();
  if (contact) return contact;

  const email = String(p?.email || "").trim();
  if (email) return email;

  return ""; // show nothing
}

export default function ChatArea({
  selectedContact,
  onReadContact,
  currentUser,
  myProfile, // ✅ pass userData here if you want
  contacts = [], // ✅ pass contacts if you use forward modal
}) {
  // ---- refs
  const chatAreaRef = useRef(null);
  const sentAudio = useRef(null);
  const receivedAudio = useRef(null);

  // ---- state (keep yours, but no duplicates)
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, msg: null });
  const [forwardModal, setForwardModal] = useState({ open: false, msg: null });
  const [forwardSelected, setForwardSelected] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [unreadMsgIds, setUnreadMsgIds] = useState([]);
  const [pinnedMsgIds, setPinnedMsgIds] = useState([]);

  // ---- names (no Unknown/User)
  const contactName = useMemo(() => displayNameOf(selectedContact), [selectedContact]);
  const myName = useMemo(() => displayNameOf(myProfile), [myProfile]);

  // ---- handlers (keep yours, these are minimal)
  const handleSend = async (text) => {
    if (!currentUser || !selectedContact) return;
    const t = String(text || "").trim();
    if (!t) return;

    // your real send logic goes here...
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: t, senderId: currentUser.uid }]);

    if (sentAudio.current) {
      try { sentAudio.current.currentTime = 0; sentAudio.current.play(); } catch {}
    }
  };

  const addMessageToChat = async (user, contact, text) => {
    if (!user || !contact) return;
    const t = String(text || "").trim();
    if (!t) return;

    // your real forward logic goes here...
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: t, senderId: user.uid }]);
  };

  const handleMenuAction = (action, msg) => {
    setMenu({ visible: false, x: 0, y: 0, msg: null });

    if (!msg) return;

    if (action === "pin") {
      setPinnedMsgIds((prev) =>
        prev.includes(msg.id) ? prev.filter((id) => id !== msg.id) : [...prev, msg.id]
      );
    }

    if (action === "forward") {
      setForwardModal({ open: true, msg });
    }
  };

  // ---- empty state
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
    <div className="flex flex-col h-full bg-slate-50 rounded-xl shadow-md">
      <div className="sticky top-0 z-10 bg-white rounded-t-xl">
        <ChatHeader contact={selectedContact} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
        {loading ? (
          <div className="text-slate-400 text-center">Loading messages...</div>
        ) : messages.length === 0 ? null : (
          <>
            {/* Message bubbles: show both sender and receiver */}
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser?.uid;
              const avatar = isMe ? myProfile?.photoURL : selectedContact?.photoURL;
              const name = isMe ? myName : contactName;
              return (
                <div key={msg.id || idx} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                  {!isMe && (
                    <img src={avatar || AllIcon} alt={name} className="w-8 h-8 rounded-full mr-2 border border-slate-300" />
                  )}
                  <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-emerald-50 text-slate-900' : 'bg-white text-slate-800'} flex flex-col`}>
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-base mt-1 mb-2">{msg.text}</span>
                    <span className="text-xs text-slate-400 mt-1 self-end">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  {isMe && (
                    <img src={avatar || AllIcon} alt={name} className="w-8 h-8 rounded-full ml-2 border border-slate-300" />
                  )}
                </div>
              );
            })}

            {/* Popup menu */}
            {menu.visible && menu.msg && (
              <div
                className="absolute bg-white border border-gray-200 rounded-lg py-2 px-0 min-w-[160px]"
                style={{
                  left: menu.x,
                  top: menu.y,
                  background: "#fff",
                  boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
                }}
              >
                {pinnedMsgIds.includes(menu.msg.id) ? (
                  <button
                    className="text-left px-4 py-2 bg-white text-red-600 w-full"
                    onClick={() => handleMenuAction("pin", menu.msg)}
                  >
                    Unpin
                  </button>
                ) : (
                  <>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100">
                      <span>Copy</span>
                    </button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100">
                      <img src={ReplyIcon} alt="Reply" className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleMenuAction("forward", menu.msg)}
                    >
                      <img src={ForwardIcon} alt="Forward" className="w-4 h-4" />
                      <span>Forward</span>
                    </button>
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleMenuAction("pin", menu.msg)}
                    >
                      <span>Pin message</span>
                    </button>
                    <button
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleMenuAction("more", menu.msg)}
                    >
                      <img src={MoreIcon} alt="More" className="w-4 h-4" />
                      <span>More</span>
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() =>
                        setUnreadMsgIds((prev) =>
                          prev.includes(menu.msg.id)
                            ? prev.filter((id) => id !== menu.msg.id)
                            : [...prev, menu.msg.id]
                        )
                      }
                    >
                      {unreadMsgIds.includes(menu.msg.id) ? "Mark as read" : "Mark as unread"}
                    </button>

                    {!multiSelectMode ? (
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMultiSelectMode(true)}
                      >
                        Select multiple
                      </button>
                    ) : (
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={() => setMultiSelectMode(false)}
                      >
                        Exit multi-select
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Forward Modal */}
            {forwardModal.open && forwardModal.msg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <img src={ForwardIcon} alt="Forward" className="w-5 h-5" /> Forward message
                  </h2>

                  {/* Message preview */}
                  <div className="mb-4 p-3 bg-slate-50 rounded border text-sm text-slate-700">
                    <span className="font-semibold">Message:</span> {forwardModal.msg.text || "(No text)"}
                  </div>

                  <div className="max-h-64 overflow-y-auto mb-4">
                    {contacts.length === 0 ? (
                      <div className="text-slate-500 text-center">Loading contacts...</div>
                    ) : (
                      <ul>
                        {contacts.map((c) => {
                          const name = displayNameOf(c);
                          return (
                            <li
                              key={c.id || c.uid}
                              className={`flex items-center gap-2 py-2 px-2 hover:bg-slate-100 rounded cursor-pointer ${forwardSelected.includes(c.id || c.uid) ? 'bg-emerald-50 border border-emerald-200' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={forwardSelected.includes(c.id || c.uid)}
                                onChange={() => {
                                  const id = c.id || c.uid;
                                  setForwardSelected((sel) =>
                                    sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
                                  );
                                }}
                              />
                              <img
                                src={c.photoURL || AllIcon}
                                alt={name || ""}
                                className="w-8 h-8 rounded-full object-cover border"
                              />
                              <span className="truncate flex-1 font-medium text-slate-800">{name || "\u00A0"}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200"
                      onClick={() => setForwardModal({ open: false, msg: null })}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-emerald-500 text-white font-semibold disabled:opacity-50"
                      disabled={forwardSelected.length === 0}
                      onClick={async () => {
                        if (!currentUser || !forwardModal.msg) return;
                        for (const id of forwardSelected) {
                          const c = contacts.find((x) => (x.id || x.uid) === id);
                          if (c) await addMessageToChat(currentUser, c, forwardModal.msg.text);
                        }
                        setForwardModal({ open: false, msg: null });
                        setForwardSelected([]);
                      }}
                    >
                      Forward to {forwardSelected.length > 0 ? `${forwardSelected.length} contact${forwardSelected.length > 1 ? 's' : ''}` : '...'}
                    </button>
                  </div>

                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setForwardModal({ open: false, msg: null })}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Typing indicator (no Unknown/User) */}
      {otherTyping && (
        <div className="px-4 pb-2 text-xs text-emerald-500 animate-pulse">
          {(contactName || "\u00A0")} is typing...
        </div>
      )}

      {/* Fixed input area */}
      <div className="sticky bottom-0 bg-white rounded-b-xl shadow-md p-3">
        <MessageInput
          onSend={handleSend}
          disabled={sending}
          selectedContact={selectedContact}
          currentUser={currentUser}
        />
      </div>

      {/* Audio elements */}
      <audio ref={sentAudio} src={sentSound} preload="auto" />
      <audio ref={receivedAudio} src={receivedSound} preload="auto" />
    </div>
  );
}
