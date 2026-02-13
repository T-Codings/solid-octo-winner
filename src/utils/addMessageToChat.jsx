// src/utils/addMessageToChat.jsx
import { addDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { updateLastMessage } from "./updateLastMessage";

function getChatId(a, b) {
  return [a, b].sort().join("_");
}

export async function addMessageToChat(currentUser, otherUser, text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return;

  const chatId = getChatId(currentUser.uid, otherUser.uid);
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    text: cleanText,
    senderUid: currentUser.uid,
    timestamp: serverTimestamp(),
  });

  await updateLastMessage(currentUser, otherUser, cleanText);

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
