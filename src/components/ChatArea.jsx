// src/components/ChatArea.jsx

import React, { useState, useRef } from "react";
import AllIcon from "../assets/all.png";
import ForwardIcon from "../assets/telegram.png";
import MoreIcon from "../assets/more2fill.png";
import ContactList from "./ContactList";
import pinnedIcon from "../assets/pinned.png";
import { db } from "../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { addMessageToChat } from "../utils/addMessageToChat";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import useChatMessages from "./useChatMessages";

export default function ChatArea({ selectedContact }) {
  const { currentUser } = useAuth();
  const [sending, setSending] = useState(false);
  const { messages, loading } = useChatMessages(currentUser, selectedContact);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, msg: null });
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyMsg, setReplyMsg] = useState(null);
  const [pinnedMsgIds, setPinnedMsgIds] = useState([]);
  const [reactingMsgId, setReactingMsgId] = useState(null);
  const [reactions, setReactions] = useState({});
  const [unreadMsgIds, setUnreadMsgIds] = useState([]);
  const [selectedMsgIds, setSelectedMsgIds] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const chatAreaRef = useRef(null);
  const [forwardModal, setForwardModal] = useState({ open: false, msg: null });
  const [forwardSelected, setForwardSelected] = useState([]);
  const [contacts, setContacts] = useState([]);

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


  // Reset unreadCount to 0 when opening this chat
  React.useEffect(() => {
    if (!currentUser || !selectedContact) return;
    import("firebase/firestore").then(({ doc, updateDoc }) => {
      updateDoc(
        doc(
          require("../firebaseConfig").db,
          "contacts",
          currentUser.uid,
          "list",
          selectedContact.uid || selectedContact.id
        ),
        { unreadCount: 0 }
      ).catch(() => {});
    });
  }, [currentUser, selectedContact]);

  if (!selectedContact) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Select a contact to start chatting
        </div>
      </div>
    );
  }

  // Menu actions
  const handleMenuAction = async (action, msg) => {
    setMenu({ ...menu, visible: false });
    if (action === "copy") {
      if (multiSelectMode && selectedMsgIds.length > 0) {
        const texts = messages.filter(m => selectedMsgIds.includes(m.id)).map(m => m.text).join("\n");
        navigator.clipboard.writeText(texts);
      } else {
        navigator.clipboard.writeText(msg.text);
      }
    } else if (action === "reply") {
      setReplyMsg(msg);
    } else if (action === "forward") {
      // WhatsApp-style: open modal to pick contacts
      setForwardModal({ open: true, msg });
      setForwardSelected([]);
      // Fetch contacts for modal (if not already loaded)
      if (contacts.length === 0 && currentUser) {
        import("firebase/firestore").then(({ collection, getDocs }) => {
          getDocs(collection(db, "contacts", currentUser.uid, "list")).then((snap) => {
            setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          });
        });
      }
    } else if (action === "other") {
      alert("Other action placeholder");
    } else if (action === "delete") {
      if (!currentUser || !selectedContact) return;
      const chatId = [currentUser.uid, selectedContact.uid].sort().join("_");
      if (multiSelectMode && selectedMsgIds.length > 0) {
        for (const id of selectedMsgIds) {
          const m = messages.find(m => m.id === id);
          if (m && m.senderId === currentUser.uid) {
            await deleteDoc(doc(db, "chats", chatId, "messages", id));
          }
        }
        setSelectedMsgIds([]);
        setMultiSelectMode(false);
      } else if (msg.senderId === currentUser.uid) {
        await deleteDoc(doc(db, "chats", chatId, "messages", msg.id));
      }
    } else if (action === "edit") {
      if (msg.senderId !== currentUser.uid) return;
      setEditingMsgId(msg.id);
      setEditText(msg.text);
    } else if (action === "pin") {
      if (multiSelectMode && selectedMsgIds.length > 0) {
        setPinnedMsgIds((ids) => {
          let newIds = [...ids];
          // If all selected are already pinned, unpin all; else, pin all
          const allPinned = selectedMsgIds.every(id => ids.includes(id));
          if (allPinned) {
            newIds = newIds.filter(id => !selectedMsgIds.includes(id));
          } else {
            selectedMsgIds.forEach(id => {
              if (!newIds.includes(id)) newIds.push(id);
            });
          }
          return newIds;
        });
      } else {
        setPinnedMsgIds((ids) => ids.includes(msg.id)
          ? ids.filter(id => id !== msg.id)
          : [...ids, msg.id]);
      }
    } else if (action === "react") {
      setReactingMsgId(msg.id);
    } else if (action === "unread") {
      if (multiSelectMode && selectedMsgIds.length > 0) {
        setUnreadMsgIds((ids) => {
          const newIds = [...ids];
          selectedMsgIds.forEach(id => {
            if (!newIds.includes(id)) newIds.push(id);
          });
          return newIds;
        });
      } else {
        setUnreadMsgIds((ids) => ids.includes(msg.id) ? ids.filter(id => id !== msg.id) : [...ids, msg.id]);
      }
    } else if (action === "select") {
      setMultiSelectMode(true);
      setSelectedMsgIds([msg.id]);
    } else if (action === "exit-multiselect") {
      setMultiSelectMode(false);
      setSelectedMsgIds([]);
    }
  };

  const handleReact = (msgId, emoji) => {
    setReactions((prev) => ({ ...prev, [msgId]: emoji }));
    setReactingMsgId(null);
  };

  const handleEditSave = async (msg) => {
    if (!currentUser || !selectedContact) return;
    const chatId = [currentUser.uid, selectedContact.uid].sort().join("_");
    await updateDoc(doc(db, "chats", chatId, "messages", msg.id), { text: editText });
    setEditingMsgId(null);
  };

  // Hide menu on click outside
  React.useEffect(() => {
    if (!menu.visible) return;
    const handler = (e) => {
      if (chatAreaRef.current && !chatAreaRef.current.contains(e.target)) {
        setMenu({ ...menu, visible: false });
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menu]);

  return (
    <div className="flex flex-col h-full" ref={chatAreaRef}>
      <div className="sticky top-0 z-10 bg-white">
        <ChatHeader contact={selectedContact} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
        {loading ? null : messages.length === 0 ? (
          null
        ) : (
          <>
            {/* Pinned messages section */}
            {pinnedMsgIds.length > 0 && (
              <div className="mb-4 rounded-lg p-2">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <img src={pinnedIcon} alt="Pinned" className="w-5 h-5" style={{marginRight: 6}} />
                  <span>Pinned Messages</span>
                </div>
                <div className="space-y-2 max-w-full">
                    {messages.filter(msg => pinnedMsgIds.includes(msg.id)).map((msg) => (
                      <div
                        key={msg.id}
                        className="break-words px-4 py-2  text-gray-900 rounded text-[16px] max-w-full"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
                        onDoubleClick={e => {
                          if (!multiSelectMode) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenu({
                              visible: true,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                              msg,
                            });
                          }
                        }}
                      >
                        {msg.text}
                        {reactions[msg.id] && <span className="ml-2 text-xl">{reactions[msg.id]}</span>}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {/* Regular (unpinned) messages */}
            {messages.filter(msg => !pinnedMsgIds.includes(msg.id)).map((msg) => {
              const isSender = msg.senderId === currentUser.uid;
              const profile = isSender
                ? {
                    name:
                      currentUser.displayName ||
                      currentUser.fullName ||
                      currentUser.name ||
                      (currentUser.firstName && currentUser.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : ""),
                    photoURL: currentUser.photoURL || undefined,
                  }
                : {
                    name:
                      selectedContact.displayName ||
                      selectedContact.fullName ||
                      selectedContact.name ||
                      (selectedContact.firstName && selectedContact.lastName ? `${selectedContact.firstName} ${selectedContact.lastName}` : ""),
                    photoURL: selectedContact.photoURL || undefined,
                  };
              const pinned = false;
              const unread = unreadMsgIds.includes(msg.id);
              return (
                <div
                  key={msg.id}
                  className={`flex items-end ${isSender ? "justify-end" : "justify-start"} ${pinned ? "ring-2 ring-yellow-400" : ""} ${unread ? "bg-yellow-50" : ""}`}
                        onDoubleClick={(e) => {
                          if (!multiSelectMode) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenu({
                              visible: true,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                              msg,
                            });
                          }
                        }}
                  onClick={() => {
                    if (multiSelectMode) {
                      setSelectedMsgIds(ids => ids.includes(msg.id) ? ids.filter(id => id !== msg.id) : [...ids, msg.id]);
                    }
                  }}
                >
                  {multiSelectMode && (
                    <input
                      type="checkbox"
                      checked={selectedMsgIds.includes(msg.id)}
                      onChange={() => setSelectedMsgIds(ids => ids.includes(msg.id) ? ids.filter(id => id !== msg.id) : [...ids, msg.id])}
                      className="mr-2 mt-6"
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                  {!isSender && (
                    <img
                      src={profile.photoURL}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-2 mb-6"
                      style={{ alignSelf: "flex-start" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-2 text-xs text-slate-400 mb-1 ${isSender ? "justify-end" : "justify-start"}`}>
                      <span>
                        {msg.createdAtMs
                          ? new Date(msg.createdAtMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : ""}
                      </span>
                      <span className="text-slate-700 font-semibold">{profile.name}</span>
                      {unread && <span className="ml-1 text-yellow-600">• Unread</span>}
                    </div>
                    {editingMsgId === msg.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          className="border rounded px-2 py-1 text-sm"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          autoFocus
                        />
                        <button className="text-emerald-600 font-bold" onClick={() => handleEditSave(msg)}>Save</button>
                        <button className="text-gray-500" onClick={() => setEditingMsgId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div
                        className={`break-words px-4 py-2 rounded-xl shadow text-[16px] ${isSender ? "bg-sky-500 text-right text-white" : "bg-white text-left text-[16px] text-gray-800"}`}
                        style={{ maxWidth: '650px', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {msg.text}
                        {reactions[msg.id] && <span className="ml-2 text-xl">{reactions[msg.id]}</span>}
                        {replyMsg && replyMsg.id === msg.id && (
                          <span className="ml-2 text-xs text-emerald-600">(Replying)</span>
                        )}
                      </div>
                    )}
                  </div>
                  {isSender && (
                    <img
                      src={profile.photoURL}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 ml-2 mb-6"
                      style={{ alignSelf: "flex-start" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {/* Emoji picker for react */}
                  {reactingMsgId === msg.id && (
                    <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-wrap gap-2 w-64">
                      {["😀","😂","😍","👍","🙏","🎉","❤️","🔥","🥳","😢","😡","😎","😇","🤔","😏","😬","😱","😴","🤩","😜","🤪","😕","😒","😓","😔","😲","😖","😭","😤","😡","😠","🤬","😷","🤒","🤕","🤢","🤮","🤧","🥳","🥺","🤠","🤡","🤥","🤫","🤭","🧐","🤓","😈","👿","👹","👺","💀","👻","👽","🤖","💩"].map(e=>(
                        <button key={e} className="text-2xl p-1 hover:bg-gray-100 rounded" onClick={()=>handleReact(msg.id,e)}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Popup menu */}
            {menu.visible && (
              <div
                className="absolute bg-white border border-gray-200 rounded-lg py-2 px-0 min-w-[160px]"
                style={{ left: menu.x, top: menu.y, background: '#fff', boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)' }}
              >
                {pinnedMsgIds.includes(menu.msg.id) && (
                  <button className=" text-left px-4 py-2 bg-white text-red-600 " onClick={() => handleMenuAction("pin", menu.msg)}>Unpin</button>
                )}
                {!pinnedMsgIds.includes(menu.msg.id) && (
                  <>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("copy", menu.msg)}><span>Copy</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("reply", menu.msg)}><span>Reply</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("forward", menu.msg)}><img src={ForwardIcon} alt="Forward" className="w-4 h-4" /><span>Forward</span></button>
                    <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleMenuAction("other", menu.msg)}><img src={MoreIcon} alt="Other" className="w-4 h-4" /><span>Other</span></button>
                    {menu.msg.senderId === currentUser.uid && (
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
                          <div className="flex flex-col items-center justify-center py-4">
                            <span className="w-6 h-6 mb-2 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
                            <span className="text-sky-600 font-semibold text-sm">Loading contacts...</span>
                          </div>
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
                            if (!currentUser || !forwardModal.msg) return;
                            for (const id of forwardSelected) {
                              const c = contacts.find(x => x.id === id);
                              if (c) await addMessageToChat(currentUser, c, forwardModal.msg.text);
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
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}


    




