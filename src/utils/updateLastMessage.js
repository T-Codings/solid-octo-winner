// src/utils/updateLastMessage.js
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

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

  // Sender's sidebar entry: reset unreadCount to 0
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
      unreadCount: 0,
    },
    { merge: true }
  );

  // Receiver's sidebar entry: increment unreadCount
  const receiverContactRef = doc(db, "contacts", receiver.uid, "list", sender.uid);
  // Get current unreadCount
  let prevUnread = 0;
  try {
    const snap = await import("firebase/firestore").then(({ getDoc }) => getDoc(receiverContactRef));
    if (snap && snap.exists()) {
      prevUnread = snap.data().unreadCount || 0;
    }
  } catch {}
  await setDoc(
    receiverContactRef,
    {
      uid: sender.uid,
      fullName: safeName(sender),
      photoURL: sender.photoURL || "",
      lastMessage: text || "",
      updatedAt: serverTimestamp(),
      updatedAtMs: nowMs,
      lastMessageAt: serverTimestamp(),
      lastMessageAtMs: nowMs,
      unreadCount: prevUnread + 1,
    },
    { merge: true }
  );
}
