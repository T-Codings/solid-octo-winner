// src/utils/addMessageToChat.jsx
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { updateLastMessage } from "./updateLastMessage";

function getChatId(a, b) {
  return [a, b].sort().join("_");
}

export async function addMessageToChat(currentUser, otherUser, text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return;

  const chatId = getChatId(currentUser.uid, otherUser.uid);

  // 1) add message
  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text: cleanText,
    senderId: currentUser.uid, // ✅ match your rules (senderId)
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });

  // 2) update contacts list entries (both sides)
  await updateLastMessage(currentUser, otherUser, cleanText);

  // 3) update chat summary
  await setDoc(
    doc(db, "chats", chatId),
    {
      members: [currentUser.uid, otherUser.uid], // ✅ match your rules (members)
      lastMessage: cleanText,
      lastMessageAt: serverTimestamp(),
      lastMessageAtMs: Date.now(),
      updatedAt: serverTimestamp(),
      updatedAtMs: Date.now(),
    },
    { merge: true }
  );
}
