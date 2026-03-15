import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScroll, faShieldHalved, faBolt, faUserShield,
  faTriangleExclamation, faCircleCheck, faGavel,
  faEnvelope, faArrowUp, faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function TermsOfService() {
  const [visible, setVisible] = useState(false);
  const [openIdx, setOpenIdx] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const sections = [
    {
      icon:  faCircleCheck,
      title: "Acceptance of Terms",
      short: "By using EV Bharat, you agree to these terms.",
      content: [
        "By accessing or using EV Bharat's platform or any associated services, you agree to be bound by these Terms of Service.",
        "If you do not agree, please discontinue use of the platform immediately.",
        "We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.",
        "Users must be at least 18 years of age or have parental/guardian consent.",
      ],
    },
    {
      icon:  faBolt,
      title: "Use of the Platform",
      short: "Personal, non-commercial use only.",
      content: [
        "EV Bharat grants you a limited, non-exclusive, non-transferable license for personal, non-commercial use.",
        "You may not scrape data, upload malicious content, or attempt unauthorized access.",
        "Station data submitted must be accurate. Knowingly submitting false information is a violation.",
        "Station listings may not be used for commercial resale without explicit written permission.",
      ],
    },
    {
      icon:  faUserShield,
      title: "Account Responsibilities",
      short: "You are responsible for your account activity.",
      content: [
        "You are responsible for maintaining the confidentiality of your credentials and all account activity.",
        "Notify us at support@evbharat.com immediately if you suspect unauthorized account access.",
        "EV Bharat may suspend accounts that violate these terms or engage in fraudulent activity.",
        "One person may not maintain multiple accounts. Duplicates are subject to removal.",
      ],
    },
    {
      icon:  faShieldHalved,
      title: "User-Generated Content",
      short: "You own your content; we can display it.",
      content: [
        "By submitting station listings, reviews, or photos, you grant EV Bharat a royalty-free license to display that content.",
        "You retain ownership but are responsible for ensuring it doesn't infringe third-party rights.",
        "We reserve the right to remove misleading or offensive content without prior notice.",
        "Reviews must reflect genuine first-hand experiences. Fake reviews are strictly prohibited.",
      ],
    },
    {
      icon:  faTriangleExclamation,
      title: "Limitation of Liability",
      short: "Station data is provided as-is.",
      content: [
        "EV Bharat provides station data on an 'as-is' basis with no guarantee of accuracy or availability.",
        "We are not liable for any damage to your vehicle or property arising from use of a listed station.",
        "Charging costs displayed are indicative — actual costs are set by individual operators.",
        "Our total liability shall not exceed the amount paid by you in the 12 months preceding any claim.",
      ],
    },
    {
      icon:  faScroll,
      title: "Privacy & Data",
      short: "We don't sell your data.",
      content: [
        "Your use of EV Bharat is governed by our Privacy Policy, incorporated here by reference.",
        "We collect usage data, location data (when permitted), and account information to improve the platform.",
        "We do not sell your personal data to third parties.",
        "You may request deletion of your account and data by contacting support@evbharat.com.",
      ],
    },
    {
      icon:  faGavel,
      title: "Governing Law",
      short: "Indian law applies, courts in Mumbai.",
      content: [
        "These Terms are governed by the laws of India.",
        "Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
        "If any provision is found unenforceable, remaining provisions continue in full effect.",
        "These Terms constitute the entire agreement between you and EV Bharat.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-6 relative overflow-hidden">

      {/* Bg blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72
                      bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14">

          <div className={`inline-flex items-center gap-2 px-4 py-1.5
                           rounded-full bg-emerald-50 border border-emerald-200
                           text-emerald-600 text-xs font-bold uppercase tracking-widest mb-6
                           transition-all duration-500
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Legal · EV Bharat
          </div>

          <h1 className={`text-4xl md:text-6xl font-extrabold text-gray-900
                          tracking-tight leading-tight
                          transition-all duration-700 ease-out delay-100
                          ${visible ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-5 blur-sm"}`}>
            Terms of{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent">
              Service
            </span>
          </h1>

          {/* Electric underline */}
          <div className={`h-px w-32 mx-auto mt-4 mb-6
                           bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                           transition-all duration-1000 ease-out delay-400
                           ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />

          {/* Meta pill */}
          <div className={`inline-flex items-center gap-4
                           bg-white border border-gray-200 rounded-2xl
                           px-5 py-3 text-xs text-gray-400
                           shadow-sm
                           transition-all duration-600 ease-out delay-200
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Effective: March 15, 2026
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              {sections.length} Sections
            </span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faGavel} className="text-emerald-500 text-[9px]" />
              Indian Law
            </span>
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="space-y-3 mb-10">
          {sections.map((section, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i}
                className={`rounded-2xl border overflow-hidden
                             transition-all duration-500 ease-out
                             ${isOpen
                               ? "border-emerald-200 shadow-lg shadow-emerald-100/60 bg-white"
                               : "border-gray-100 bg-white hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50"
                             }
                             ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                style={{
                  transitionDelay:    visible ? `${300 + i * 70}ms` : "0ms",
                  transitionDuration: "600ms",
                }}>

                {/* Top accent bar — visible when open */}
                <div className={`h-0.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500
                                 transition-all duration-300
                                 ${isOpen ? "opacity-100" : "opacity-0"}`} />

                {/* Row button */}
                <button onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left">

                  {/* Step number */}
                  <div className={`w-8 h-8 rounded-lg shrink-0
                                   flex items-center justify-center
                                   text-[10px] font-black
                                   transition-all duration-300
                                   ${isOpen
                                     ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200"
                                     : "bg-gray-50 text-gray-400 border border-gray-200"
                                   }`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl shrink-0
                                   flex items-center justify-center
                                   transition-all duration-300
                                   ${isOpen
                                     ? "bg-emerald-100 text-emerald-600 scale-110"
                                     : "bg-gray-50 text-gray-400 border border-gray-100"
                                   }`}>
                    <FontAwesomeIcon icon={section.icon} className="text-xs" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight
                                   transition-colors duration-200
                                   ${isOpen ? "text-emerald-700" : "text-gray-800"}`}>
                      {section.title}
                    </p>
                    {!isOpen && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate">
                        {section.short}
                      </p>
                    )}
                  </div>

                  {/* Chevron */}
                  <div className={`w-7 h-7 rounded-lg shrink-0
                                   flex items-center justify-center
                                   transition-all duration-300
                                   ${isOpen
                                     ? "bg-emerald-100 text-emerald-600 rotate-180"
                                     : "bg-gray-50 text-gray-400 border border-gray-100"
                                   }`}>
                    <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                  </div>
                </button>

                {/* Content */}
                <div className={`overflow-hidden transition-all duration-400 ease-in-out
                                 ${isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-6 pb-6">
                    <div className="h-px bg-gradient-to-r from-emerald-100
                                    via-gray-100 to-transparent mb-5" />
                    <ul className="space-y-3">
                      {section.content.map((point, j) => (
                        <li key={j}
                          className="flex items-start gap-3"
                          style={{
                            opacity:   isOpen ? 1 : 0,
                            transform: isOpen ? "translateX(0)" : "translateX(-8px)",
                            transition:`all 0.4s ease ${j * 60}ms`,
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400
                                           shrink-0 mt-1.5" />
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {point}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Contact banner ── */}
        <div className={`relative bg-gradient-to-br from-emerald-50 to-teal-50
                         rounded-2xl border border-emerald-100
                         overflow-hidden p-8 text-center
                         transition-all duration-700 ease-out
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "900ms" }}>

          {/* Soft glow */}
          <div className="absolute inset-0
                          bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                          pointer-events-none" />

          <div className="relative">
            <div className="w-14 h-14 rounded-full
                            bg-white border border-emerald-200
                            shadow-sm flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="text-emerald-500 text-lg" />
            </div>

            <h3 className="text-gray-900 font-extrabold text-lg mb-2">
              Questions about these terms?
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Our legal team will respond within 2 business days.
              We're here to help you understand your rights.
            </p>

            <a href="mailto:legal@evbharat.com"
              className="inline-flex items-center gap-2
                         bg-gradient-to-r from-emerald-500 to-teal-500
                         text-white px-7 py-3 rounded-xl text-sm font-semibold
                         shadow-md shadow-emerald-200
                         hover:shadow-lg hover:brightness-110
                         hover:scale-105 active:scale-95
                         transition-all duration-200">
              <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
              legal@evbharat.com
            </a>
          </div>
        </div>

      </div>

      {/* Scroll to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50
                    w-11 h-11 rounded-full
                    bg-gradient-to-br from-emerald-500 to-teal-500
                    text-white shadow-lg shadow-emerald-200
                    flex items-center justify-center
                    hover:scale-110 active:scale-95
                    transition-all duration-300
                    ${showTop
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                    }`}>
        <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
      </button>

    </div>
  );
}

export default TermsOfService;
