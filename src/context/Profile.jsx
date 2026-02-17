import { allCountries } from "country-telephone-data";
// src/routes/Profile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  User,
  Phone,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Search,
  X,
} from "lucide-react";



function isoToFlag(iso2 = "") {
  const code = String(iso2 || "").toUpperCase();
  if (code.length !== 2) return "🌍";
  const A = 0x1f1e6;
  const alphaA = "A".charCodeAt(0);
  const first = A + (code.charCodeAt(0) - alphaA);
  const second = A + (code.charCodeAt(1) - alphaA);
  return String.fromCodePoint(first, second);
}

const COUNTRY_CODES = (Array.isArray(allCountries) ? allCountries : [])
  .map((c) => {
    const name = String(c?.name || c?.[0] || "").trim();
    const iso2 = String(c?.iso2 || c?.[1] || "").trim().toUpperCase();
    const dialRaw = String(c?.dialCode || c?.[2] || "").trim();
    const dial = dialRaw
      ? dialRaw.startsWith("+")
        ? dialRaw
        : `+${dialRaw}`
      : "";
    return { name, iso2, dial, flag: isoToFlag(iso2) };
  })
  .filter((c) => c.name && c.iso2 && c.dial)
  .sort((a, b) => a.name.localeCompare(b.name));

function CountryCodePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef(null);

  const selected =
    COUNTRY_CODES.find((c) => c.dial === value) ||
    COUNTRY_CODES.find((c) => c.iso2 === "CM") ||
    COUNTRY_CODES[0];

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.iso2.toLowerCase().includes(s) ||
        c.dial.includes(s)
    );
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 });
  useEffect(() => {
    if (!open) return;
    const el = btnRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setPos({
        top: r.bottom + 10,
        left: Math.min(r.left, window.innerWidth - 340),
        width: Math.max(r.width, 260),
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-3 py-3 text-slate-100 outline-none hover:bg-slate-950/50 transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{selected?.flag || "🌍"}</span>
          <span className="text-sm text-slate-200 truncate">
            {selected?.dial || "+000"} <span className="text-slate-400">•</span>{" "}
            {selected?.iso2 || "XX"}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-slate-300" />
      </button>

      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed z-[9999] rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden"
              style={{
                top: pos.top,
                left: pos.left,
                width: Math.min(pos.width, 360),
                maxWidth: "90vw",
              }}
            >
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search country, ISO, or code…"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    autoFocus
                  />
                  {q && (
                    <button
                      type="button"
                      onClick={() => setQ("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-white transition"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[320px] overflow-auto">
                {filtered.map((c) => (
                  <button
                    key={`${c.iso2}-${c.dial}`}
                    type="button"
                    onClick={() => {
                      onChange(c.dial);
                      setOpen(false);
                      setQ("");
                    }}
                    className="w-full px-3 py-2.5 flex items-center gap-3 text-left hover:bg-white/5 transition"
                  >
                    <span className="text-lg">{c.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-slate-100 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.iso2} • {c.dial}
                      </div>
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-slate-300">
                    No results.
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

function calcCompletion75({ firstName, lastName, phoneNumber }) {
  const checks = [
    !!String(firstName || "").trim(),
    !!String(lastName || "").trim(),
    !!String(phoneNumber || "").trim(),
  ];
  const done = checks.reduce((sum, ok) => sum + (ok ? 1 : 0), 0);
  return Math.round((done / 4) * 100); // max 75
}

export default function Profile() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+237");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  const fullName = useMemo(
    () => `${firstName} ${lastName}`.trim(),
    [firstName, lastName]
  );

  const completion = useMemo(
    () => calcCompletion75({ firstName, lastName, phoneNumber }),
    [firstName, lastName, phoneNumber]
  );

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

          const c = Number(data.profileCompletion ?? 0);
          const complete = Boolean(data.profileComplete) && c >= 75;

          if (complete) {
            // ✅ show a stable loader and navigate once
            setRedirecting(true);
            navigate("/contacts", { replace: true });
            return;
          }
        }
      } catch {
        if (alive) setError("Unable to load profile.");
      } finally {
        if (alive) setFetching(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [currentUser, navigate]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser) return setError("You must be logged in.");

    const f = firstName.trim();
    const l = lastName.trim();
    const cc = String(countryCode || "").trim();
    const pn = String(phoneNumber || "").trim();

    if (!f || !l || !cc || !pn) return setError("Please complete all fields.");

    const profileCompletion = calcCompletion75({
      firstName: f,
      lastName: l,
      phoneNumber: pn,
    });

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
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
        },
        { merge: true }
      );

      // ✅ navigate once, with a stable loader
      setRedirecting(true);
      navigate("/contacts", { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || fetching || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
        <span className="ml-4 text-white text-lg font-semibold">
          {redirecting ? "Opening chats..." : "Loading profile..."}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 " />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white tracking-tight">
              Complete your profile
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Completion:{" "}
              <span className="text-white font-semibold">{completion}%</span>{" "}
              ({completion === 75 ? "Completed" : "Fill 3 fields"})
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-7">
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-3xl bg-slate-950/40 border border-white/10 overflow-hidden flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-300" />
                )}
              </div>

              <div className="mt-3 text-center">
                <p className="text-white font-semibold">
                  {fullName || "Your Name"}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Photo upload disabled (Storage rules).
                </p>
              </div>

              <label className="mt-3 cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 transition">
                <ImageIcon className="w-4 h-4" />
                Choose photo (preview only)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    placeholder="e.g. Theodore"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-10 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    placeholder="e.g. Nyang"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-10 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Phone number
                </label>

                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <CountryCodePicker
                      value={countryCode}
                      onChange={setCountryCode}
                    />
                  </div>

                  <div className="relative col-span-3">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      placeholder="6xx xxx xxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-10 pr-3 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={saving}
                className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
