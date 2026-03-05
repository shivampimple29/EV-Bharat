import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-950 to-slate-900 text-gray-300">
      <div className="max-w-8xl mx-auto px-8 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div
          className="flex flex-col lg:flex-row 
                        sm:flex-col
                        justify-between gap-6 lg:gap-32"
        >
          {/* LEFT SIDE */}
          <div className="max-w-md w-full mx-auto lg:mx-0 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full 
                    bg-gradient-to-t from-emerald-400 to-teal-600 
                    flex items-center justify-center 
                    text-white font-bold"
              >
                <i className="fa-solid fa-bolt"></i>
              </div>

              <div>
                <h2 className="font-semibold text-white">EV Bharat</h2>
                <p className="text-sm text-gray-400">Charging India</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Helping India transition to sustainable transportation by
              connecting EV users with charging infrastructure across the
              nation.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition">
                <i className="fa-brands fa-twitter"></i>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition">
                <i className="fa-brands fa-github"></i>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition">
                <i className="fa-brands fa-linkedin"></i>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition">
                <i className="fa-regular fa-envelope"></i>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Grouped) */}
          <div className="flex flex-col items-center text-center flex-1 justify-around lg:flex-row gap-7 lg:text-left ">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Find Stations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Add Station
                  </a>
                </li>
                <li>
                  {/* <a href="#" className="hover:text-white transition">
                    EV Guide
                  </a> */}
                  <Link className="hover:text-white transition" to="/guide">EV Guide</Link>
                </li>
                <li>
                
                  <Link className="hover:text-white transition" to="/charging-tips">Charging Tips</Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API Access
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="border-t border-slate-800 mt-12 pt-6 
                        flex flex-col md:flex-row 
                        justify-between items-center 
                        text-sm text-gray-500 gap-4"
        >
          <p>© 2026 EV Bharat. All rights reserved.</p>

          <p>
            Made with <span className="text-red-500"><i class="fa-solid fa-heart"></i></span> for India's EV
            Revolution
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
