
import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Users, Zap } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ================= Welcome Hero ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 mb-4">
          Connect instantly with friends, join groups, and chat securely.
        </p>
        <Link
          to="/chats"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          Start Chatting
        </Link>
      </div>

      {/* ================= Quick Actions ================= */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <Zap className="h-10 w-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Lightning Fast
          </h3>
          <p className="text-gray-600 text-center">
            Messages deliver instantly with real-time syncing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <MessageCircle className="h-10 w-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Real-Time Chat
          </h3>
          <p className="text-gray-600 text-center">
            Smooth, delay-free conversations on any device.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <Users className="h-10 w-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Group Chats
          </h3>
          <p className="text-gray-600 text-center">
            Create or join chat groups to stay connected with your friends.
          </p>
        </div>
      </div>

      {/* ================= Recent Chats Placeholder ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Chats
        </h2>
        <p className="text-gray-500">
          Your recent conversations will appear here.
        </p>
      </div>
    </div>
  );
}

export default Home;
