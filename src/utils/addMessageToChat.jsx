// src/utils/updateLastMessage.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function updateLastMessage(sender, receiver, text) {
  const timestamp = serverTimestamp();

  // Update sender's sidebar doc
  await setDoc(
    doc(db, "sidebarContacts", sender.uid),
    {
      uid: sender.uid,
      name: sender.name || "",
      photoURL: sender.photoURL || null,
      lastMessage: text || "",
      lastMessageTime: timestamp,
    },
    { merge: true }
  );

  // Update receiver's sidebar doc
  await setDoc(
    doc(db, "sidebarContacts", receiver.uid),
    {
      uid: receiver.uid,
      name: receiver.name || "",
      photoURL: receiver.photoURL || null,
      lastMessage: text || "",
      lastMessageTime: timestamp,
    },
    { merge: true }
  );
}
