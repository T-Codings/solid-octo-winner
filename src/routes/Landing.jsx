// src/routes/Landing.jsx (or wherever your Landing is)
import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Lock,
  Smartphone,
  Users,
  Smile,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import ChatIcon from "../assets/ChatIcon.png";

export default function Landing() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Messages deliver instantly with real-time syncing across devices.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      desc: "Your chats stay private with modern security practices.",
    },
    {
      icon: Smile,
      title: "User Friendly",
      desc: "Clean and intuitive interface designed for simplicity.",
    },
    {
      icon: Users,
      title: "Group Chats",
      desc: "Create or join chat groups and stay connected with your circle.",
    },
    {
      icon: Smartphone,
      title: "Cross-Device Sync",
      desc: "Works seamlessly on mobile, tablet, and desktop.",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      desc: "Smooth, delay-free chat powered by modern technology.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background like SignUp */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-6xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
                <img src={ChatIcon} alt="Chat Icon" className="w-10 h-10" />
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Fast, Simple & Sweet Messaging
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                Stay connected with smooth real-time chatting. Beautiful design,
                effortless communication, and private conversations — all in one place.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition"
                >
                  Get Started for Free <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-white/10 border border-white/10 backdrop-blur hover:bg-white/15 transition"
                >
                  Sign In <Lock className="w-4 h-4" />
                </Link>
              </div>

              {/* Small trust line */}
              <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                No ads • Clean UI • Your conversations stay yours
              </div>
            </div>

            {/* Main glass card */}
            <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Why you’ll love it
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Everything you need to chat confidently — fast and simple.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Real-time
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Secure
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    Multi-device
                  </span>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-white/10 bg-slate-950/30 hover:bg-slate-950/40 transition p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition">
                        <feature.icon className="w-5 h-5 text-slate-100" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-300">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-center md:text-left">
                  <p className="text-white font-semibold">
                    Ready to start chatting?
                  </p>
                  <p className="text-sm text-slate-300">
                    Create an account in seconds and continue.
                  </p>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                  <Link
                    to="/signup"
                    className="flex-1 md:flex-none inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 md:flex-none inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/15 transition"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer tiny */}
            <div className="mt-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} • Built with React + Firebase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
