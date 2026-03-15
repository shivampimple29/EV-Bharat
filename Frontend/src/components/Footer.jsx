import { Link } from "react-router-dom";

function Footer() {
  const quickLinks = [
    { label: "Find Stations", href: "#station-list", external: true },
    { label: "Add Station", href: "#", external: true },
    { label: "EV Guide", to: "/guide" },
    { label: "Charging Tips", to: "/charging-tips" },
    { label: "Partners", href: "#", external: true },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/HelpCenter", external: true },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", href: "/PrivacyPolicy", external: true },
    { label: "Terms of Service", href: "/TermsOfService", external: true },
    { label: "API Access", href: "#", external: true },
  ];

  const socials = [
    { icon: "fa-brands fa-twitter", label: "Twitter" },
    { icon: "fa-brands fa-github", label: "GitHub" },
    { icon: "fa-brands fa-linkedin", label: "LinkedIn" },
    { icon: "fa-regular fa-envelope", label: "Email" },
  ];

  return (
    <footer
      className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
                       text-gray-300 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-500/5 rounded-full blur-3xl
                      pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64
                      bg-teal-500/5 rounded-full blur-3xl
                      pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* ── Top Section ── */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          {/* ── LEFT — Brand ── */}
          <div className="max-w-sm w-full mx-auto lg:mx-0 text-center lg:text-left">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
              <div className="relative group/logo">
                <div
                  className="absolute inset-0 rounded-full bg-emerald-400/20
                                blur-md opacity-0 group-hover/logo:opacity-100
                                transition-opacity duration-300"
                />
                <div
                  className="relative w-11 h-11 rounded-full
                                bg-gradient-to-br from-teal-500 to-emerald-400
                                flex items-center justify-center
                                text-white shadow-lg shadow-emerald-900/40
                                group-hover/logo:scale-110
                                transition-transform duration-300"
                >
                  <i className="fa-solid fa-bolt text-sm" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-white text-base leading-tight">
                  EV Bharat
                </h2>
                <p
                  className="text-[10px] text-emerald-400/80 font-medium
                              tracking-widest uppercase"
                >
                  Charging India
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Helping India transition to sustainable transportation by
              connecting EV users with charging infrastructure across the
              nation.
            </p>

            {/* Social icons */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              {socials.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl
                             bg-slate-800 border border-slate-700/60
                             flex items-center justify-center
                             text-gray-400
                             hover:bg-emerald-500/10 hover:border-emerald-500/30
                             hover:text-emerald-400 hover:scale-110
                             active:scale-95
                             transition-all duration-200"
                >
                  <i className={`${s.icon} text-sm`} />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Links ── */}
          <div
            className="flex flex-col sm:flex-row
                          items-center sm:items-start
                          justify-center lg:justify-end
                          text-center sm:text-left
                          gap-10 flex-1"
          >
            {/* Quick Links */}
            <div>
              <h3
                className="text-white font-bold text-sm
                             uppercase tracking-widest mb-5
                             flex items-center justify-center sm:justify-start gap-2"
              >
                <span className="w-4 h-px bg-emerald-500" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-sm text-gray-400
                                   hover:text-emerald-400
                                   hover:translate-x-1
                                   inline-flex items-center gap-1.5
                                   transition-all duration-200"
                      >
                        <span
                          className="w-1 h-1 rounded-full bg-emerald-500/0
                                         group-hover:bg-emerald-500
                                         transition-colors duration-200"
                        />
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400
                                   hover:text-emerald-400
                                   hover:translate-x-1
                                   inline-flex items-center gap-1.5
                                   transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3
                className="text-white font-bold text-sm
                             uppercase tracking-widest mb-5
                             flex items-center justify-center sm:justify-start gap-2"
              >
                <span className="w-4 h-px bg-teal-500" />
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-sm text-gray-400
                                   hover:text-emerald-400
                                   hover:translate-x-1
                                   inline-flex items-center gap-1.5
                                   transition-all duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400
                                   hover:text-emerald-400
                                   hover:translate-x-1
                                   inline-flex items-center gap-1.5
                                   transition-all duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="mt-14 mb-6
                        h-px bg-gradient-to-r
                        from-transparent via-slate-700 to-transparent"
        />

        {/* ── Bottom Section ── */}
        <div
          className="flex flex-col md:flex-row
                        justify-between items-center
                        text-xs text-gray-500 gap-3"
        >
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />©
            2026 EV Bharat. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Made with
            <span
              className="inline-flex items-center justify-center
                             w-5 h-5 rounded-full bg-red-500/10
                             text-red-400 animate-pulse"
            >
              <i className="fa-solid fa-heart text-[9px]" />
            </span>
            for India's EV Revolution
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
