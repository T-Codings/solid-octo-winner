import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Chaticon from "../assets/chaticon.png";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User2, Settings2 } from "lucide-react";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const username = useMemo(() => {
    const email = currentUser?.email || "";
    if (!email) return "User";
    return email.split("@")[0];
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition ${
      isActive
        ? "bg-white/15 text-white"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* top gradient bar like your SignUp theme */}
      <nav className="border-b border-white/10 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-700 shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Chaticon} alt="Logo" className="h-9 w-9 rounded-lg" />
            <div className="hidden sm:block leading-tight">
              <div className="text-white font-extrabold tracking-tight">
                Chat App
              </div>
            </div>
          </Link>

          {/* CENTER: Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>

            {currentUser ? (
              <>
                <NavLink to="/contacts" className={linkClass}>
                  Contacts
                </NavLink>
              </>
            ) : null}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-extrabold bg-white text-indigo-700 hover:opacity-95 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2">
                  <User2 className="w-4 h-4 text-white/90" />
                  <span className="text-white text-sm font-semibold truncate max-w-[140px]">
                    {username}
                  </span>
                </div>

            

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-extrabold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition inline-flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
              aria-label="Open menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-slate-950/35 backdrop-blur-xl">
            <div
              ref={panelRef}
              className="mx-auto max-w-6xl px-4 py-4 space-y-3"
            >
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>

              {currentUser ? (
                <>
                  <NavLink to="/contacts" className={linkClass}>
                    Contacts
                  </NavLink>

                  <NavLink to="/profile" className={linkClass}>
                    Profile
                  </NavLink>

                  <div className="pt-2">
                    <div className="text-white/80 text-xs mb-2">
                      Signed in as{" "}
                      <span className="text-white font-semibold">
                        {username}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition inline-flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link
                    to="/login"
                    className="px-4 py-3 rounded-xl text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-3 rounded-xl text-sm font-extrabold bg-white text-indigo-700 hover:opacity-95 transition text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
