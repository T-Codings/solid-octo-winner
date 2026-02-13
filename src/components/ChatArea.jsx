// utils/updateLastMessage.js
import { addMessageToChat } from "../utils/addMessageToChat";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function updateLastMessage(sender, receiver, text) {
  const timestamp = serverTimestamp();

  // Update sender's contact list
  await setDoc(
    doc(db, "sidebarContacts", sender.uid),
    {
      uid: sender.uid,
      name: sender.name,
      photoURL: sender.photoURL || null,
      lastMessage: text || "",
      lastMessageTime: timestamp,
    },
    { merge: true }
  );

  // Update receiver's contact list
  await setDoc(
    doc(db, "sidebarContacts", receiver.uid),
    {
      uid: receiver.uid,
      name: receiver.name,
      photoURL: receiver.photoURL || null,
      lastMessage: text || "",
      lastMessageTime: timestamp,
    },
    { merge: true }
  );

  const handleSend = async () => {
    if (!message.trim()) return;

    await addMessageToChat(currentUser, selectedContact, message);
    setMessage("");
  };
  await addMessageToChat(currentUser, selectedContact, message);
}
