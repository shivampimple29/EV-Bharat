import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt, faUser, faRightFromBracket,
  faChevronDown, faGauge, faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const handleNavClick = (e, link) => {
    if (link.href.startsWith("/#")) {
      e.preventDefault();
      const id = link.href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Not on home page yet — navigate then scroll
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: "Find Stations", href: "/stations" },
    { label: "About", href: "/#about" },
    { label: "FAQ", href: "/#faq" },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  // First letter avatar
  const avatar = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-300/30 blur-md group-hover:blur-lg transition-all duration-300" />
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center shadow-md">
                <FontAwesomeIcon icon={faBolt} className="text-white text-sm" />
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">EV Bharat</p>
              <p className="text-[10px] text-emerald-500 font-medium leading-tight">Charging India</p>
            </div>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === link.href
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* User button */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200
                             bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200
                             transition-all duration-200"
                >
                  {/* Avatar circle */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400
                                  flex items-center justify-center text-white text-xs font-bold">
                    {avatar}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gray-400 text-xs transition-transform duration-200
                                ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-100
                                  shadow-lg shadow-gray-100/50 py-1.5 z-50
                                  animate-[fadeInUp_0.15s_ease_forwards]">
                    {/* User info header */}
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1
                        ${user.role === "admin"
                          ? "bg-purple-50 text-purple-600"
                          : user.role === "station_owner"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}>
                        {user.role === "station_owner" ? "Station Owner" : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>

                    {/* Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600
                                 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-xs w-3" />
                      My Profile
                    </Link>

                    {/* Admin dashboard — admin only */}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600
                                   hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faGauge} className="text-xs w-3" />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Add station — station_owner only */}
                    {user.role === "station_owner" && (
                      <Link
                        to="/add-station"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600
                                   hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs w-3" />
                        Add Station
                      </Link>
                    )}

                    <div className="border-t border-gray-50 mt-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                                 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="text-xs w-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                           bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                           shadow-md shadow-emerald-200 hover:shadow-lg hover:scale-[1.02]
                           active:scale-95 transition-all duration-200"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center
                       bg-gray-50 border border-gray-200 hover:bg-emerald-50
                       hover:border-emerald-200 hover:scale-105 active:scale-95
                       transition-all duration-200"
          >
            <div className="space-y-1.5">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-200
                                ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-200
                                ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-200
                                ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* ── Mobile Dropdown ── */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => { handleNavClick(e, link); setIsMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                           text-gray-600 hover:bg-emerald-50 hover:text-emerald-600
                           transition-all duration-200
                           opacity-0 animate-[fadeInUp_0.3s_ease_forwards]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-2" />

            {user ? (
              <>
                {/* Mobile — user info */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400
                                  flex items-center justify-center text-white text-sm font-bold">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-emerald-600">{user.role}</p>
                  </div>
                </div>

                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                               text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <FontAwesomeIcon icon={faGauge} className="text-xs" />
                    Admin Dashboard
                  </Link>
                )}

                {user.role === "station_owner" && (
                  <Link to="/add-station" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                               text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    Add Station
                  </Link>
                )}

                <Link to="/profile" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
             text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm
                             font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                           text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white shadow-sm shadow-emerald-200 active:scale-95
                           transition-all duration-200"
              >
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;