// src/routes/Landing.jsx
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
  Sparkles,
  CheckCircle2,
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

  const steps = [
    {
      title: "Create an account",
      desc: "Sign up in seconds and secure your profile.",
    },
    {
      title: "Add your contacts",
      desc: "Find friends and start chatting instantly.",
    },
    {
      title: "Chat in real-time",
      desc: "Messages sync smoothly across your devices.",
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
            <div className="text-center mb-12">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
                <img src={ChatIcon} alt="Chat Icon" className="w-12 h-12 sm:w-14 sm:h-14" />
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                Fast, Simple & Sweet Messaging
              </h1>

              <p className="mt-4 text-lg sm:text-xl md:text-2xl text-slate-200/90 max-w-3xl mx-auto leading-relaxed">
                Stay connected with smooth real-time chatting. Beautiful design,
                effortless communication, and private conversations — all in one
                place.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 shadow-lg shadow-emerald-500/10 hover:opacity-95 active:scale-[0.99] transition"
                >
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base sm:text-lg font-semibold text-white bg-white/10 border border-white/10 backdrop-blur hover:bg-white/15 transition"
                >
                  Sign In <Lock className="w-5 h-5" />
                </Link>
              </div>

              {/* Quick trust row (restored) */}
            </div>

            {/* Main glass card (restored glass + border) */}
            <div className="rounded-2xl p-6 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Why you’ll love it
                </h2>
                <p className="mt-2 text-base sm:text-lg md:text-xl text-slate-200/85 max-w-3xl leading-relaxed">
                  Everything you need to chat confidently — fast and simple.
                </p>
              </div>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-slate-950/30 hover:bg-slate-950/40 transition p-6 sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition">
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-100" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base sm:text-lg text-slate-200/80 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
