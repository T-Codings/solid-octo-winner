import NoteCard from "../component/NoteCard";
import NoteForm from "../component/NoteForm";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseconfig";
import { useAuth } from "../context/AuthContext";
import { StickyNote, FileWarning } from "lucide-react";
import { onSnapshot, query, where, collection } from "firebase/firestore";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return; // Wait until currentUser is available

    setLoading(true);

    const notesQuery = query(
      collection(db, "notes"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      notesQuery,
      (querySnapshot) => {
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        notesData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });

        setNotes(notesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notes", error);
        setError("Failed to fetch notes. Please try refreshing the page.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Notes</h1>
        <p className="text-gray-600">Create and manage your personal notes</p>
      </div>

      <NoteForm />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <FileWarning className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-indigo-600">Loading notes...</div>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No notes yet
          </h3>
          <p className="text-gray-600 mb-1">
            Create your first note to get started
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
