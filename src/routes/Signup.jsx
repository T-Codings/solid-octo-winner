// src/routes/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailTrimmed = useMemo(() => String(email || "").trim(), [email]);

  const passwordMismatch = useMemo(() => {
    return confirmPassword.length > 0 && password !== confirmPassword;
  }, [password, confirmPassword]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordMismatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCred = await signup(emailTrimmed, password);
      const user = userCred.user;

      // ✅ Create user doc (profile not complete yet)
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email || emailTrimmed,

          firstName: "",
          lastName: "",
          fullName: "",

          countryCode: "+237",
          phoneNumber: "",

          photoURL: "",

          profileCompletion: 0,
          profileComplete: false,

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // ✅ Go to Profile after signup
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shadow-lg">
              <UserPlus className="w-7 h-7 text-emerald-200" />
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Create your account
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-slate-200/90 leading-relaxed">
              Start chatting with a smoother, modern experience.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-7">
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-base font-semibold text-slate-200">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-11 py-4 text-base sm:text-lg text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-semibold text-slate-200">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl bg-slate-950/40 border border-white/10 px-11 pr-12 py-4 text-base sm:text-lg text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/10 transition"
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-semibold text-slate-200">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className={[
                      "w-full rounded-xl bg-slate-950/40 border px-11 pr-12 py-4 text-base sm:text-lg text-slate-100 placeholder:text-slate-400 outline-none focus:ring-4 transition",
                      passwordMismatch
                        ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10"
                        : "border-white/10 focus:border-emerald-400/50 focus:ring-emerald-400/10",
                    ].join(" ")}
                    required
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {passwordMismatch && (
                  <p className="text-sm text-red-200/90">
                    Passwords don’t match.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordMismatch}
                className="w-full rounded-2xl py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-center text-base sm:text-lg text-slate-200/85 pt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-200 hover:text-white transition"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
