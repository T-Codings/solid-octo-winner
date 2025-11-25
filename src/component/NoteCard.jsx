import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { Trash } from "lucide-react";

function NoteCard({ note }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formDate = (timestamp) => {
    if (!timestamp) return "Just Now";

    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-CMR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "notes", note.id));
    } catch (error) {
      console.error("error deleting notes", error);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
            {note.title}
          </h3>
          <button
            className={`text-sm flex items-center justify-center p-1 rounded-full transition-colors ${
              confirmDelete
                ? "bg-red-400 text-red-600"
                : "text-gray-400 hover:text-red-50"
            }`}
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-700 text-sm mb-3 whitespace-pre-line">
          {note.content || <span className="text-gray-400">No content</span>}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400 border-t pt-2">
          {formDate(note.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
