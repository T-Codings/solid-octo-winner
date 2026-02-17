import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { allCountries } from "country-telephone-data"; // keep your picker dependencies
// keep your isoToFlag / COUNTRY_CODES / CountryCodePicker here (unchanged)

function calcCompletion75({ firstName, lastName, phoneNumber }) {
  const checks = [
    !!String(firstName || "").trim(),
    !!String(lastName || "").trim(),
    !!String(phoneNumber || "").trim(),
  ];
  const done = checks.reduce((sum, ok) => sum + (ok ? 1 : 0), 0);
  return Math.round((done / 4) * 100); // your logic (max 75)
}

function FullPageLoader({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Loader2 className="w-12 h-12 animate-spin" />
      <span className="ml-4 text-lg font-semibold">{label}</span>
    </div>
  );
}

export default function Profile() {
  const { currentUser, userData, userDataLoading, setUserData } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+237");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // ✅ prevents StrictMode/double effect redirect loops
  const didRedirectRef = useRef(false);

  const completion = useMemo(
    () => calcCompletion75({ firstName, lastName, phoneNumber }),
    [firstName, lastName, phoneNumber]
  );

  // Load profile once
  useEffect(() => {
    if (!currentUser) return;

    let alive = true;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (!alive) return;

        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setCountryCode(data.countryCode || "+237");
          setPhoneNumber(data.phoneNumber || "");
          setPhotoPreview(data.photoURL || "");

          // ✅ redirect only if truly complete, and only once
          const complete = data.profileComplete === true;
          const c = Number(data.profileCompletion ?? 0);

          if (complete && c >= 75 && !didRedirectRef.current) {
            didRedirectRef.current = true;
            navigate("/contacts", { replace: true });
            return;
          }
        }
      } catch (e) {
        console.error(e);
        if (alive) setError("Unable to load profile.");
      } finally {
        if (alive) setFetching(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser) return setError("You must be logged in.");

    const f = firstName.trim();
    const l = lastName.trim();
    const cc = String(countryCode || "").trim();
    const pn = String(phoneNumber || "").trim();

    if (!f || !l || !cc || !pn) return setError("Please complete all fields.");

    const profileCompletion = calcCompletion75({ firstName: f, lastName: l, phoneNumber: pn });

    setSaving(true);
    try {
      const payload = {
        uid: currentUser.uid,
        firstName: f,
        lastName: l,
        fullName: `${f} ${l}`,
        countryCode: cc,
        phoneNumber: pn,
        contact: `${cc} ${pn}`,
        profileCompletion,
        profileComplete: profileCompletion >= 75,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", currentUser.uid), payload, { merge: true });

      // ✅ update context immediately so /contacts doesn't bounce you back
      setUserData((prev) => ({ ...(prev || {}), ...payload }));

      if (payload.profileComplete && !didRedirectRef.current) {
        didRedirectRef.current = true;
        navigate("/contacts", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (userDataLoading || fetching) {
    return <FullPageLoader label="Loading profile..." />;
  }

  // optional: if userData already complete, just show loader briefly and go
  if (userData?.profileComplete && !didRedirectRef.current) {
    didRedirectRef.current = true;
    navigate("/contacts", { replace: true });
    return <FullPageLoader label="Opening chats..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6">
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <h1 className="text-2xl font-bold text-white">Complete your profile</h1>
        <p className="mt-1 text-sm text-slate-300">
          Completion: <span className="text-white font-semibold">{completion}%</span>
        </p>

        {/* keep your existing UI form below, unchanged, but make sure onSubmit calls handleSubmit */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* ... your inputs + CountryCodePicker ... */}

          <button
            disabled={saving}
            className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
