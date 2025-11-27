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

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* ======== HERO SECTION ========= */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <MessageCircle className="h-16 w-16 text-indigo-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold 
          text-gray-800 max-w-2xl mx-auto mb-6">
            Fast, Simple & Sweet Messaging for Everyone
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Stay connected with smooth real-time chatting. Beautiful design,
            effortless communication, and private conversations all in one
            place.
          </p>
        </div>

        {/* ================= CTA BUTTONS ================= */}
        <div className="flex flex-col md:flex-row 
        items-center justify-center gap-4 mb-12">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-600 text-white 
            rounded-lg font-medium shadow 
            hover:bg-indigo-700 transition-all"
          >
            Get Started for Free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 bg-white text-indigo-600 
            border rounded-lg font-medium
             hover:bg-indigo-50 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* ================= FEATURES SECTION ================= */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto p-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md 
          border border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row items-center 
            md:items-start text-center md:text-left mb-3">
              <Zap className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Lightning Fast
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Messages deliver instantly with real-time syncing across devices.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md 
          border border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row items-center
             md:items-start text-center md:text-left mb-3">
              <Lock className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Secure & Private
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Your chats are protected with modern encryption for full privacy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md border
           border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row items-center 
            md:items-start text-center md:text-left mb-3">
              <Smile className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                User Friendly
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Clean and intuitive interface designed for simplicity.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md border 
          border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row
            items-center md:items-start text-center md:text-left mb-3">
              <Users className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Group Chats
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Create or join chat groups and stay connected with your circle.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-md border
           border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row 
            items-center md:items-start text-center md:text-left mb-3">
              <Smartphone className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Cross-Device Sync
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Works seamlessly on mobile, tablet, and desktop.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-md 
          border border-indigo-100 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row items-center 
            md:items-start text-center md:text-left mb-3">
              <MessageCircle className="h-6 w-6 text-indigo-600 mb-2 md:mb-0 md:mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">
                Real-Time Chat
              </h3>
            </div>
            <p className="text-gray-600 text-center md:text-left">
              Smooth, delay-free chat powered by modern technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
