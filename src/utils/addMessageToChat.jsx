// src/utils/addMessageToChat.js
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { updateLastMessage } from "./updateLastMessage.";

function getChatId(a, b) {
  // ✅ stable chatId (same for both users)
  return [a, b].sort().join("_");
}

export async function addMessageToChat(currentUser, otherUser, text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return;

  const chatId = getChatId(currentUser.uid, otherUser.uid);
  const messagesRef = collection(db, "chats", chatId, "messages");

  // 1) Save message
  await addDoc(messagesRef, {
    text: cleanText,
    senderUid: currentUser.uid,
    timestamp: serverTimestamp(),
  });

  // 2) Update both contacts
  await updateLastMessage(currentUser, otherUser, cleanText);

  // 3) Update chat meta
  await setDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: cleanText,
      lastMessageTime: serverTimestamp(),
      users: [currentUser.uid, otherUser.uid],
    },
    { merge: true }
  );
}
