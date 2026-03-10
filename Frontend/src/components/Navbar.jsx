import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full 
                    bg-white/70 backdrop-blur-md 
                    border-b border-gray-200/60"
    >
      <div
        className="max-w-8xl mx-auto px-4 md:px-8 py-4 
                      flex items-center justify-between"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full 
                          bg-gradient-to-t from-emerald-400 to-teal-600 
                          flex items-center justify-center 
                          text-white font-bold"
          >
            <i className="fa-solid fa-bolt"></i>
          </div>

          <div>
            <h1 className="font-semibold nav-link">EV Bharat</h1>
            <p className="text-xs text-gray-500">Charging India</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div
          className="hidden md:flex items-center gap-8 
                        text-gray-600 font-medium"
        >
          <a href="#station-list" className="nav-link">
            Find Stations
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </div>

        {/* Desktop Button */}
        <button
          className="hidden md:flex 
                           btn-green"
        >
          <span className="px-2">

          </span>
          <Link to='/auth'>Login / Register</Link>
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bg-gradient-to-t from-emerald-400 to-teal-600 bg-clip-text text-transparent">
            <i className="fa-solid fa-bars text-xl"></i>
          </span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div
          className="md:hidden px-6 pb-4 mt-3
                        flex flex-col justify-center gap-4 
                        text-gray-700 font-medium 
                        bg-white/80 backdrop-blur-md"
        >
          <a href="#" className="nav-link text-center">
            Find Stations
          </a>
          <a href="#" className="nav-link text-center">
            About
          </a>
          <a href="#" className="nav-link text-center">
            FAQ
          </a>

          <button
            className="mt-2 
                        bg-gradient-to-t from-emerald-400 to-teal-600 
                    text-white px-4 py-2 rounded-lg"
          >
            Add Station
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
