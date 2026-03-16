import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Find Stations", href: "#station-list" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full
                    bg-white/80 backdrop-blur-lg
                    border-b border-gray-200/60
                    shadow-sm shadow-gray-100/80
                    transition-all duration-300"
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 py-3.5
                      flex items-center justify-between"
      >
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group">
    
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full
                            bg-emerald-300/30 blur-md
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300"
            />
            <div
              className="relative w-10 h-10 rounded-full
                            bg-gradient-to-br from-teal-500 to-emerald-400
                            flex items-center justify-center
                            text-white shadow-md shadow-emerald-200
                            group-hover:scale-110 group-hover:shadow-lg
                            group-hover:shadow-emerald-200
                            transition-all duration-300"
            >
              <i className="fa-solid fa-bolt text-sm" />
            </div>
          </div>

          <div>
            <h1
              className="font-bold text-gray-900 leading-tight
                           group-hover:text-emerald-600
                           transition-colors duration-200"
            >
              EV Bharat
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              Charging India
            </p>
          </div>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 rounded-xl
                         text-sm font-medium text-gray-500
                         hover:text-emerald-600 hover:bg-emerald-50
                         transition-all duration-200
                         group"
            >
              {link.label}
              {/* Underline dot */}
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2
                               w-1 h-1 rounded-full bg-emerald-400
                               opacity-0 group-hover:opacity-100
                               scale-0 group-hover:scale-100
                               transition-all duration-200"
              />
            </a>
          ))}
        </div>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2
                       px-5 py-2.5 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white shadow-sm shadow-emerald-200
                       hover:shadow-md hover:shadow-emerald-200
                       hover:scale-105 active:scale-95
                       transition-all duration-200"
          >
            <i className="fa-solid fa-right-to-bracket text-xs" />
            Login / Register
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl
                     flex items-center justify-center
                     bg-gray-50 border border-gray-200
                     hover:bg-emerald-50 hover:border-emerald-200
                     hover:scale-105 active:scale-95
                     transition-all duration-200"
        >
          <i
            className={`fa-solid text-emerald-600 text-sm
                         transition-all duration-300
                         ${isMenuOpen ? "fa-xmark rotate-90" : "fa-bars"}`}
          />
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      <div
        className={`md:hidden overflow-hidden
                       transition-all duration-300 ease-in-out
                       ${
                         isMenuOpen
                           ? "max-h-80 opacity-100"
                           : "max-h-0 opacity-0"
                       }`}
      >
        <div
          className="px-4 pb-5 pt-2
                        bg-white/90 backdrop-blur-lg
                        border-t border-gray-100"
        >
          {/* Mobile nav links */}
          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                           text-sm font-medium text-gray-600
                           hover:bg-emerald-50 hover:text-emerald-600
                           transition-all duration-200
                           opacity-0 animate-[fadeInUp_0.3s_ease_forwards]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px bg-gradient-to-r from-transparent
                          via-gray-200 to-transparent mb-4"
          />

          {/* Mobile CTA */}
          <Link
            to="/auth"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2
                       w-full py-3 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white shadow-sm shadow-emerald-200
                       hover:shadow-md hover:shadow-emerald-200
                       active:scale-95 transition-all duration-200"
          >
            <i className="fa-solid fa-right-to-bracket text-xs" />
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
