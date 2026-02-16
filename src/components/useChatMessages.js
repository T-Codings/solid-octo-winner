
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig";

function getChatId(a, b) {
  return [a, b].sort().join("_");
}

export default function useChatMessages(currentUser, contact) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !contact) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const chatId = getChatId(currentUser.uid, contact.uid);
    // Try to order by createdAtMs, fallback to createdAt if needed
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAtMs", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // If createdAtMs is missing, sort by createdAt (Firestore Timestamp)
      if (docs.length && docs.some(m => !m.createdAtMs) && docs.some(m => m.createdAt)) {
        docs = docs.sort((a, b) => {
          const aTime = a.createdAtMs || (a.createdAt && a.createdAt.toMillis && a.createdAt.toMillis()) || 0;
          const bTime = b.createdAtMs || (b.createdAt && b.createdAt.toMillis && b.createdAt.toMillis()) || 0;
          return aTime - bTime;
        });
      }
      setMessages(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser, contact]);

  return { messages, loading };
}
