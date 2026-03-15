import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved, faBolt, faArrowUp, faChevronDown,
  faUserShield, faEye, faLock, faShareNodes,
  faCookieBite, faChild, faEnvelope, faGavel,
} from "@fortawesome/free-solid-svg-icons";

function PrivacyPolicy() {
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
      icon:  faEye,
      title: "Information We Collect",
      short: "What data EV Bharat collects from you.",
      content: [
        "Account information: name, email address, phone number, and role (user, station owner, or admin) provided during registration.",
        "Location data: GPS coordinates or city-level location when you search for nearby charging stations — only when you grant permission.",
        "Usage data: pages visited, search queries, station views, and interaction patterns to improve platform performance.",
        "User-submitted content: station listings, reviews, photos, and ratings you voluntarily contribute to the platform.",
        "Device information: browser type, operating system, IP address, and device identifiers for security and analytics purposes.",
      ],
    },
    {
      icon:  faBolt,
      title: "How We Use Your Data",
      short: "Why we collect and how we process it.",
      content: [
        "To provide and improve the EV Bharat platform — including station search, map display, and availability updates.",
        "To personalise your experience by remembering preferences, recently viewed stations, and frequently visited areas.",
        "To send service-related communications such as booking confirmations, station updates, and security alerts.",
        "To analyse usage trends and fix bugs — helping us build a faster, more reliable platform for all EV drivers.",
        "To verify station submissions from community contributors before they go live on the platform.",
      ],
    },
    {
      icon:  faShareNodes,
      title: "Data Sharing",
      short: "We don't sell your data — ever.",
      content: [
        "We do not sell, rent, or trade your personal data to any third party for marketing or commercial purposes.",
        "We may share data with trusted service providers (e.g., cloud hosting, analytics) who process it solely on our behalf under strict confidentiality agreements.",
        "Station operators may see aggregated, anonymised usage statistics for their listed stations — never individual user data.",
        "We may disclose data if required by Indian law, court order, or to protect the safety and rights of our users.",
        "In the event of a merger or acquisition, user data may be transferred — you will be notified in advance.",
      ],
    },
    {
      icon:  faLock,
      title: "Data Security",
      short: "How we protect your information.",
      content: [
        "All data is transmitted over HTTPS with TLS encryption. Passwords are hashed using industry-standard algorithms.",
        "We conduct periodic security audits and vulnerability assessments of our infrastructure.",
        "Access to personal data is restricted to authorised personnel only, on a need-to-know basis.",
        "While we implement strong safeguards, no system is 100% secure. We encourage using strong, unique passwords.",
        "In the event of a data breach, we will notify affected users within 72 hours as required under applicable law.",
      ],
    },
    {
      icon:  faCookieBite,
      title: "Cookies & Tracking",
      short: "How we use cookies on EV Bharat.",
      content: [
        "We use essential cookies to keep you logged in and maintain session state across pages.",
        "Analytics cookies (e.g., via Google Analytics) help us understand how users interact with EV Bharat — this data is aggregated.",
        "Preference cookies remember your search filters, map zoom level, and language settings.",
        "You can disable non-essential cookies via your browser settings. Essential cookies cannot be turned off without affecting functionality.",
        "We do not use third-party advertising cookies or tracking pixels of any kind.",
      ],
    },
    {
      icon:  faUserShield,
      title: "Your Rights",
      short: "Control over your personal data.",
      content: [
        "Right to access: you can request a copy of all personal data we hold about you at any time.",
        "Right to correction: you can update your account information directly from your profile settings.",
        "Right to deletion: you can request full deletion of your account and associated data by emailing privacy@evbharat.com.",
        "Right to portability: we can provide your data in a machine-readable format (JSON or CSV) upon request.",
        "Right to object: you can opt out of analytics tracking and non-essential communications at any time.",
      ],
    },
    {
      icon:  faChild,
      title: "Children's Privacy",
      short: "EV Bharat is not for users under 13.",
      content: [
        "EV Bharat is not directed at children under the age of 13. We do not knowingly collect data from minors.",
        "If we discover that a child under 13 has provided personal data, we will delete it immediately.",
        "Users between 13 and 18 must have parental or guardian consent before using the platform.",
        "Parents or guardians who believe their child's data has been collected should contact us at privacy@evbharat.com.",
      ],
    },
    {
      icon:  faGavel,
      title: "Policy Updates & Law",
      short: "Governed by Indian law, Mumbai courts.",
      content: [
        "This Privacy Policy is governed by the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 of India.",
        "We may update this policy periodically. The 'Last Updated' date at the top reflects the most recent revision.",
        "Significant changes will be communicated via email or an in-app notification before taking effect.",
        "Disputes arising from this policy shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
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
            Privacy{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent">
              Policy
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
                           px-5 py-3 text-xs text-gray-400 shadow-sm
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
              DPDP Act 2023
            </span>
          </div>
        </div>

        {/* ── Intro card ── */}
        <div className={`relative bg-gradient-to-br from-emerald-50 to-teal-50
                         rounded-2xl border border-emerald-100 overflow-hidden
                         p-6 mb-6
                         transition-all duration-600 ease-out delay-300
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

          <div className="absolute inset-0
                          bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                          pointer-events-none" />

          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white border border-emerald-200
                            shadow-sm flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm mb-1">
                Your privacy matters to us
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                EV Bharat is committed to protecting your personal data.
                This policy explains what we collect, why we collect it,
                and how you can control it — in plain language, no legalese.
                We comply with India's{" "}
                <span className="text-emerald-600 font-semibold">
                  Digital Personal Data Protection Act, 2023
                </span>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Accordion ── */}
        <div className="space-y-3 mb-10">
          {sections.map((section, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i}
                className={`rounded-2xl border overflow-hidden bg-white
                             transition-all duration-500 ease-out
                             ${isOpen
                               ? "border-emerald-200 shadow-lg shadow-emerald-100/60"
                               : "border-gray-100 hover:border-emerald-100 hover:shadow-md hover:shadow-emerald-50"
                             }
                             ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                style={{
                  transitionDelay:    visible ? `${400 + i * 60}ms` : "0ms",
                  transitionDuration: "600ms",
                }}>

                {/* Top accent bar */}
                <div className={`h-0.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500
                                 transition-all duration-300
                                 ${isOpen ? "opacity-100" : "opacity-0"}`} />

                {/* Row */}
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
                                 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
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
          style={{ transitionDelay: "1000ms" }}>

          <div className="absolute inset-0
                          bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                          pointer-events-none" />

          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white border border-emerald-200
                            shadow-sm flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="text-emerald-500 text-lg" />
            </div>
            <h3 className="text-gray-900 font-extrabold text-lg mb-2">
              Privacy questions or data requests?
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Contact our Data Protection Officer. We respond to all
              privacy requests within{" "}
              <span className="text-emerald-600 font-semibold">
                30 days
              </span>{" "}
              as required under DPDP Act 2023.
            </p>
            <a href="mailto:privacy@evbharat.com"
              className="inline-flex items-center gap-2
                         bg-gradient-to-r from-emerald-500 to-teal-500
                         text-white px-7 py-3 rounded-xl text-sm font-semibold
                         shadow-md shadow-emerald-200
                         hover:shadow-lg hover:brightness-110
                         hover:scale-105 active:scale-95
                         transition-all duration-200">
              <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
              privacy@evbharat.com
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

export default PrivacyPolicy;
