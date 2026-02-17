// src/routes/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, currentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cleanEmail = useMemo(() => String(email || "").trim(), [email]);

  const validate = () => {
    const e = cleanEmail.toLowerCase();
    const p = String(password || "");
    const c = String(confirm || "");

    if (!e) return "Email is required.";
    if (!e.includes("@")) return "Enter a valid email.";
    if (p.length < 6) return "Password must be at least 6 characters.";
    if (p !== c) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (currentUser) {
      navigate("/profile", { replace: true });
      return;
    }

    const msg = validate();
    if (msg) return setError(msg);

    setSaving(true);
    try {
      // ✅ Create auth account
      const cred = await signup(cleanEmail, password);
      const user = cred.user;

      // ✅ Create/merge Firestore user profile (default NOT complete)
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email || cleanEmail,

          // profile fields
          firstName: "",
          lastName: "",
          fullName: "",
          countryCode: "+237",
          phoneNumber: "",
          contact: "",
          photoURL: "",

          // completion flags (IMPORTANT)
          profileCompletion: 0,
          profileComplete: false,

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // ✅ Go to profile completion
      navigate("/profile", { replace: true });
    } catch (err) {
      // Firebase auth common errors
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") setError("Email already in use. Try login.");
      else if (code === "auth/invalid-email") setError("Invalid email.");
      else if (code === "auth/weak-password") setError("Weak password. Use 6+ characters.");
      else if (code === "auth/network-request-failed") setError("Network error. Check connection.");
      else setError(err?.message || "Signup failed.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Full-screen dark loading screen while submitting
  if (saving) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-semibold">Creating account…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 relative overflow-hidden">
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-emerald-200" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-300">
              Sign up to continue to your chats.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-7">
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-10 pr-3 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-10 pr-10 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-white"
                    aria-label="Toggle password"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 pl-10 pr-10 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-white"
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition"
              >
                Sign Up
              </button>

              <p className="text-center text-sm text-slate-300">
                Already have an account?{" "}
                <Link className="text-white font-semibold hover:underline" to="/login">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
