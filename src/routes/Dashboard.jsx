import React, { useState, useEffect } from "react";
import NoteCard from "../component/NoteCard";
import NoteForm from "../component/NoteForm";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { StickyNote, FileWarning } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";

function Dashboard() {
  const { currentUser } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

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

        // Sort by newest first
        notesData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        setNotes(notesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please refresh the page.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Notes</h2>
        <p className="text-gray-600">Create and manage your personal notes</p>
      </div>

      {/* Create Note */}
      <NoteForm />

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 flex items-center">
          <FileWarning className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-indigo-600">Loading Notes...</div>
        </div>
      ) : notes.length > 0 ? (
        /* Notes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <StickyNote className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No notes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first note to get started
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
