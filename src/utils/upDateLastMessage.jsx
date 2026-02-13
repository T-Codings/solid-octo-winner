import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";


export async function addMessageToChat(currentUser, otherUser, text) {
  const chatId = `${currentUser.uid}_${otherUser.uid}`;
  const messagesRef = collection(db, "chats", chatId, "messages");

  // Add message to chat
  await addDoc(messagesRef, {
    text,
    senderUid: currentUser.uid,
    timestamp: serverTimestamp(),
  });

  // Update last message in sidebarContacts for both users
  await updateLastMessage(currentUser, otherUser, text);

  // Update lastMessage and lastMessageTime in chats doc
  await setDoc(
    doc(db, "chats", chatId),
    {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      users: [currentUser.uid, otherUser.uid],
    },
    { merge: true }
  );
}
