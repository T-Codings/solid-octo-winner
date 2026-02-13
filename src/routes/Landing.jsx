import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Lock,
  Smartphone,
  Users,
  Smile,
  Zap,
} from "lucide-react";
import ChatIcon from "../assets/ChatIcon.png"; // Correct image import

function Landing() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Messages deliver instantly with real-time syncing across devices.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      desc: "Your chats are protected with modern encryption for full privacy.",
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* ======== HERO SECTION ========= */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src={ChatIcon} alt="Chat Icon" className="h-16 w-16" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl mx-auto mb-6">
            Fast, Simple & Sweet Messaging for Everyone
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Stay connected with smooth real-time chatting. Beautiful design,
            effortless communication, and private conversations all in one
            place.
          </p>
        </div>

        {/* ================= CTA BUTTONS ================= */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/signup"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700 text-white rounded-lg font-semibold shadow-md hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-800 transition-all"
          >
            Get Started for Free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-500 border border-blue-500 rounded-lg font-semibold shadow-md hover:bg-blue-50 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* ================= FEATURES SECTION ================= */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto p-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-3">
                <feature.icon className="h-6 w-6 text-blue-500 mb-2 md:mb-0 md:mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-center md:text-left">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;


