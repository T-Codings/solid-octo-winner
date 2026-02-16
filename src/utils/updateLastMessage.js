// src/utils/updateLastMessage.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseconfig";

function safeName(u) {
  return (
    u?.fullName ||
    u?.name ||
    [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
    (u?.email ? u.email.split("@")[0] : "") ||
    "User"
  );
}

export async function updateLastMessage(sender, receiver, text) {
  const nowMs = Date.now();

  // ✅ sender's sidebar entry: contacts/{sender}/list/{receiver}
  await setDoc(
    doc(db, "contacts", sender.uid, "list", receiver.uid),
    {
      uid: receiver.uid,
      fullName: safeName(receiver),
      photoURL: receiver.photoURL || "",
      lastMessage: text || "",
      updatedAt: serverTimestamp(),
      updatedAtMs: nowMs,
      lastMessageAt: serverTimestamp(),
      lastMessageAtMs: nowMs,
    },
    { merge: true }
  );

  // ✅ receiver's sidebar entry: contacts/{receiver}/list/{sender}
  await setDoc(
    doc(db, "contacts", receiver.uid, "list", sender.uid),
    {
      uid: sender.uid,
      fullName: safeName(sender),
      photoURL: sender.photoURL || "",
      lastMessage: text || "",
      updatedAt: serverTimestamp(),
      updatedAtMs: nowMs,
      lastMessageAt: serverTimestamp(),
      lastMessageAtMs: nowMs,
    },
    { merge: true }
  );
}
