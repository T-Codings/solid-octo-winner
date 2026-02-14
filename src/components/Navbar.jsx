import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Chatties from "../assets/chatties.png";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, User2 } from "lucide-react";

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

  // ✅ Uniform button style (SignUp-like)
  const btnBase =
    "px-4 py-2 rounded-xl text-sm font-extrabold transition inline-flex items-center justify-center gap-2";
  const btnPrimary =
    `${btnBase} bg-white text-indigo-700 hover:opacity-95`;
  const btnGhost =
    `${btnBase} border border-white/40 text-white hover:bg-white/10`;
  const btnDanger =
    `${btnBase} bg-white text-red-600 hover:opacity-95`; // uniform with SignUp (no gradient)

  return (
    <header className="sticky top-0 z-50">
      <nav className="border-b border-white/10 bg-gray-800 shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Chatties} alt="Logo" className="h-6 w-auto object-contain" />
          </Link>

          {/* CENTER: Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>

            {currentUser ? (
              <NavLink to="/contacts" className={linkClass}>
                Contacts
              </NavLink>
            ) : null}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className={btnGhost}>
                  Login
                </Link>
                <Link to="/signup" className={btnPrimary}>
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

                <button onClick={handleLogout} className={btnDanger}>
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
            <div ref={panelRef} className="mx-auto max-w-6xl px-4 py-4 space-y-3">
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
                      <span className="text-white font-semibold">{username}</span>
                    </div>

                    <button onClick={handleLogout} className={`w-full ${btnDanger} py-3`}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link to="/login" className={`text-center ${btnGhost} py-3`}>
                    Login
                  </Link>
                  <Link to="/signup" className={`text-center ${btnPrimary} py-3`}>
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
