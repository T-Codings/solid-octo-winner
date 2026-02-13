import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Load profile
  useEffect(() => {
    if (!currentUser) return;

    const loadProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setContact(data.contact || "");
          setPhotoPreview(data.photoURL || "");

          if (data.profileComplete) {
            navigate("/contacts");
          }
        }
      } catch {
        setError("Unable to load profile.");
      } finally {
        setFetching(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate]);

  // Select + compress photo
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      });

      setPhotoFile(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
    } catch {
      setError("Image compression failed.");
    }
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!firstName || !lastName || !contact) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      // Save basic profile info
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          uid: currentUser.uid,
          email: currentUser.email,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          contact,
          profileComplete: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Upload Profile Photo
      if (photoFile) {
        const storageRef = ref(
          storage,
          `profile_photos/${currentUser.uid}.jpg`
        );
        const uploadTask = uploadBytesResumable(storageRef, photoFile);

        const finalPhotoURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snap) =>
              setUploadProgress(
                Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
              ),
            reject,
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        // Save Firebase HTTPS URL
        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL: finalPhotoURL,
        });
      }

      navigate("/contacts");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Loading spinner (fixed)
  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-600 border-b-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Complete Your Profile
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={currentUser.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="text-sm"
          />

          {photoPreview && (
            <img
              src={photoPreview}
              className="w-28 h-28 mx-auto rounded-full mt-3 object-cover"
            />
          )}

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
