import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar bg-emerald-800 text-white flex flex-col h-full w-20 sm:w-56 shadow-lg">
      <div className="flex flex-col items-center py-6">
        <div className="rounded-full bg-emerald-600 w-12 h-12 flex items-center justify-center mb-4 shadow-md">
          <span className="text-2xl font-bold">💬</span>
        </div>
        <div className="w-full flex flex-col items-center mb-6">
          <div className="rounded-full bg-white w-10 h-10 flex items-center justify-center mb-1">
            <span className="text-emerald-700 font-bold text-lg">
              {currentUser?.email ? currentUser.email[0].toUpperCase() : "U"}
            </span>
          </div>
          <span className="text-xs font-medium truncate w-full text-center" title={currentUser?.email}>
            {currentUser?.email || "User"}
          </span>
        </div>
        <nav className="flex flex-col gap-1 w-full">
          <Link
            to="/dashboard"
            className={`sidebar-link ${location.pathname === "/dashboard" ? "bg-emerald-700" : "hover:bg-emerald-700/80"}`}
            tabIndex={0}
            aria-label="Dashboard"
          >
            <span className="mx-3">🏠</span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            to="/contacts"
            className={`sidebar-link ${location.pathname === "/contacts" ? "bg-emerald-700" : "hover:bg-emerald-700/80"}`}
            tabIndex={0}
            aria-label="Contacts"
          >
            <span className="mx-3">👥</span>
            <span className="hidden sm:inline">Contacts</span>
          </Link>
          <Link
            to="/profile"
            className={`sidebar-link ${location.pathname === "/profile" ? "bg-emerald-700" : "hover:bg-emerald-700/80"}`}
            tabIndex={0}
            aria-label="Profile"
          >
            <span className="mx-3">👤</span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <Link
            to="/settings"
            className={`sidebar-link ${location.pathname === "/settings" ? "bg-emerald-700" : "hover:bg-emerald-700/80"}`}
            tabIndex={0}
            aria-label="Settings"
          >
            <span className="mx-3">⚙️</span>
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </nav>
      </div>
      <div className="mt-auto mb-4 flex flex-col items-center">
        <span className="text-xs text-slate-300">solid-octo-winner</span>
      </div>
    </aside>
  );
}
