import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faArrowUp,
  faChevronDown,
  faSearch,
  faMapLocationDot,
  faPlugCircleBolt,
  faUserShield,
  faCircleCheck,
  faStar,
  faHeadset,
  faEnvelope,
  faBook,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function HelpCenter() {
  const [visible, setVisible] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [contactVis, setContactVis] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setContactVis(true);
      },
      { threshold: 0.1 },
    );
    if (contactRef.current) observer.observe(contactRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = [
    { icon: faMapLocationDot, label: "Finding Stations" },
    { icon: faPlugCircleBolt, label: "Charging" },
    { icon: faUserShield, label: "Account" },
    { icon: faCircleCheck, label: "Submissions" },
  ];

  const faqs = [
    {
      cat: 0,
      q: "How do I find EV charging stations near me?",
      a: "Use the search bar on the home page — type your city, area, or pin code. You can also allow location access and click 'Near Me' to instantly see stations within your radius. Results can be filtered by connector type, availability, and distance.",
    },
    {
      cat: 0,
      q: "Can I view stations on a map?",
      a: "Yes! Switch to Map View from the station list page. Each pin shows the station name and live availability. Tap a pin to see full details including charger types, operator info, and user reviews.",
    },
    {
      cat: 0,
      q: "How do I filter by connector type?",
      a: "On the Stations page, use the filter panel on the left (desktop) or the filter button on mobile. You can filter by CCS2, CHAdeMO, Type 2, Bharat AC, and Bharat DC connector standards.",
    },
    {
      cat: 1,
      q: "How accurate is the availability data?",
      a: "Availability is synced regularly through our network partners and community updates. For high-traffic stations, data refreshes every few minutes. We recommend calling ahead for critical journeys.",
    },
    {
      cat: 1,
      q: "What do the charger speed labels mean?",
      a: "Slow (up to 3.3kW) is for overnight home charging. Fast (7.4–22kW) is standard AC public charging. Rapid (50kW DC) gives ~80% in 30 minutes. Ultra-rapid (100kW+) is for highway corridors and commercial hubs.",
    },
    {
      cat: 1,
      q: "Can I see the cost before charging?",
      a: "Where operators have shared pricing, we display it on the station detail page. Costs are set by individual operators and may vary. Always verify on the operator's own app or display unit before plugging in.",
    },
    {
      cat: 2,
      q: "How do I create an account?",
      a: "Click 'Login' in the top navigation and select the Register tab. Fill in your name, email, and password, then choose your role — User, Station Owner, or Admin. Verify your email to activate your account.",
    },
    {
      cat: 2,
      q: "How do I reset my password?",
      a: "On the Login page, click 'Forgot Password' and enter your registered email. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive. The link expires in 24 hours.",
    },
    {
      cat: 2,
      q: "How do I delete my account?",
      a: "Go to Profile Settings → scroll to the bottom → click 'Delete Account'. This permanently removes all your data including submissions, reviews, and saved stations. This action cannot be undone.",
    },
    {
      cat: 3,
      q: "How do I add a new charging station?",
      a: "Log in and click the 'Add Station' button in the top navigation or from your dashboard. Fill in the station name, address, connector types, operator details, and upload a photo. Our team reviews submissions within 24 hours.",
    },
    {
      cat: 3,
      q: "Can I edit a station I submitted?",
      a: "Yes. Go to your profile → My Submissions → find the station and click Edit. Changes go through a brief re-verification before going live. You can also report inaccuracies on any station using the 'Report an Issue' button.",
    },
    {
      cat: 3,
      q: "Why was my submission rejected?",
      a: "Submissions may be rejected if the location is a duplicate, the address is unverifiable, or required fields are incomplete. You'll receive an email explaining the reason. You can resubmit after addressing the issues.",
    },
  ];

  const guides = [
    {
      icon: faMapLocationDot,
      title: "Finding Your First Station",
      desc: "Step-by-step walkthrough of the search and map features.",
    },
    {
      icon: faPlugCircleBolt,
      title: "Understanding Charger Types",
      desc: "CCS2, CHAdeMO, Type 2 — what works for your EV.",
    },
    {
      icon: faUserShield,
      title: "Setting Up Your Account",
      desc: "Registration, roles, and profile customisation.",
    },
    {
      icon: faStar,
      title: "Writing a Good Review",
      desc: "How to leave helpful, verified station reviews.",
    },
    {
      icon: faCircleCheck,
      title: "Submitting a Station",
      desc: "How to add and verify a new charging point.",
    },
    {
      icon: faBolt,
      title: "Charging Tips for India",
      desc: "Best practices for battery health in Indian conditions.",
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchTab = f.cat === activeTab;
    const matchSearch =
      searchVal === "" ||
      f.q.toLowerCase().includes(searchVal.toLowerCase()) ||
      f.a.toLowerCase().includes(searchVal.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-6 relative overflow-hidden">
      {/* Bg blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96
                      bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72
                      bg-teal-100/30 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5
                           rounded-full bg-emerald-50 border border-emerald-200
                           text-emerald-600 text-xs font-bold uppercase tracking-widest mb-6
                           transition-all duration-500
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Help Center
          </div>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-gray-900
                          tracking-tight leading-tight mb-3
                          transition-all duration-700 ease-out delay-100
                          ${visible ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-5 blur-sm"}`}
          >
            How can we{" "}
            <span
              className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent"
            >
              help you?
            </span>
          </h1>

          {/* Electric underline */}
          <div
            className={`h-px w-32 mx-auto mt-2 mb-6
                           bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                           transition-all duration-1000 ease-out delay-300
                           ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          />

          {/* ── Search bar ── */}
          <div
            className={`relative group
                           transition-all duration-700 ease-out delay-200
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div
              className="absolute -inset-0.5 rounded-2xl
                            bg-gradient-to-r from-emerald-400 to-teal-500
                            blur opacity-20 group-hover:opacity-40
                            transition-all duration-300 pointer-events-none"
            />
            <div
              className="relative flex items-center gap-3
                            bg-white border border-gray-200 rounded-2xl
                            px-4 py-3 shadow-sm"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="text-emerald-500 text-sm shrink-0"
              />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search help articles, FAQs, guides..."
                className="flex-1 bg-transparent outline-none text-sm
                           text-gray-800 placeholder-gray-400"
              />
              {searchVal && (
                <button
                  onClick={() => setSearchVal("")}
                  className="text-gray-400 hover:text-gray-600
                             text-xs transition-colors duration-200"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick guides ── */}
        <div
          className={`mb-12
                         transition-all duration-700 ease-out delay-300
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-7 h-7 rounded-lg bg-emerald-100
                            flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={faBook}
                className="text-emerald-600 text-xs"
              />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">
              Quick Guides
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {guides.map((g, i) => (
              <button
                key={i}
                className="group flex items-center gap-3 p-4 rounded-2xl
                           bg-white border border-gray-100 shadow-sm text-left
                           hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/60
                           hover:-translate-y-0.5
                           transition-all duration-200"
                style={{
                  transitionDelay: visible ? `${350 + i * 60}ms` : "0ms",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.5s ease",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100
                                flex items-center justify-center shrink-0
                                group-hover:bg-emerald-100 group-hover:scale-110
                                transition-all duration-200"
                >
                  <FontAwesomeIcon
                    icon={g.icon}
                    className="text-emerald-600 text-xs"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-bold text-gray-900
                                group-hover:text-emerald-700
                                transition-colors duration-200 leading-snug"
                  >
                    {g.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug truncate">
                    {g.desc}
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-300 group-hover:text-emerald-400
                             text-[10px] shrink-0
                             group-hover:translate-x-0.5
                             transition-all duration-200"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── FAQ section ── */}
        <div
          className={`transition-all duration-700 ease-out delay-500
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-7 h-7 rounded-lg bg-emerald-100
                            flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-emerald-600 text-xs"
              />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Category tabs */}
          <div
            className="flex bg-white border border-gray-200
                          rounded-2xl p-1 gap-1 mb-5 overflow-x-auto"
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  setOpenFaq(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
                             text-xs font-semibold whitespace-nowrap
                             transition-all duration-200 flex-1 justify-center
                             ${
                               activeTab === i
                                 ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm"
                                 : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                             }`}
              >
                <FontAwesomeIcon icon={cat.icon} className="text-[10px]" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-2">
            {filteredFaqs.length === 0 ? (
              <div
                className="text-center py-12 bg-white rounded-2xl
                              border border-gray-100"
              >
                <div
                  className="w-12 h-12 rounded-full bg-gray-50
                                flex items-center justify-center mx-auto mb-3"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No results for "{searchVal}"
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  Try a different keyword or browse another category
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border overflow-hidden bg-white
                                 transition-all duration-300
                                 ${
                                   isOpen
                                     ? "border-emerald-200 shadow-md shadow-emerald-100/60"
                                     : "border-gray-100 hover:border-emerald-100"
                                 }`}
                  >
                    <div
                      className={`h-0.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500
                                     transition-opacity duration-300
                                     ${isOpen ? "opacity-100" : "opacity-0"}`}
                    />

                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0
                                       flex items-center justify-center
                                       text-[10px] font-black
                                       transition-all duration-300
                                       ${
                                         isOpen
                                           ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                                           : "bg-gray-50 text-gray-400 border border-gray-200"
                                       }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      <p
                        className={`flex-1 text-sm font-semibold leading-snug
                                     transition-colors duration-200
                                     ${isOpen ? "text-emerald-700" : "text-gray-800"}`}
                      >
                        {faq.q}
                      </p>

                      <div
                        className={`w-7 h-7 rounded-lg shrink-0
                                       flex items-center justify-center
                                       transition-all duration-300
                                       ${
                                         isOpen
                                           ? "bg-emerald-100 text-emerald-600 rotate-180"
                                           : "bg-gray-50 text-gray-400 border border-gray-100"
                                       }`}
                      >
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="text-[10px]"
                        />
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-400 ease-in-out
                                     ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-5 pb-5">
                        <div
                          className="h-px bg-gradient-to-r from-emerald-100
                                        via-gray-100 to-transparent mb-4"
                        />
                        <p
                          className="text-gray-500 text-sm leading-relaxed
                                      pl-11"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen
                              ? "translateX(0)"
                              : "translateX(-8px)",
                            transition: "all 0.4s ease 60ms",
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Still need help ── */}
        <div
          ref={contactRef}
          className={`relative bg-gradient-to-br from-emerald-50 to-teal-50
                       rounded-2xl border border-emerald-100 overflow-hidden
                       p-8 mt-12 text-center
                       transition-all duration-700 ease-out
                       ${contactVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div
            className="absolute inset-0
                          bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_60%)]
                          pointer-events-none"
          />

          <div className="relative">
            <div
              className="w-14 h-14 rounded-full bg-white border border-emerald-200
                            shadow-sm flex items-center justify-center mx-auto mb-4"
            >
              <FontAwesomeIcon
                icon={faHeadset}
                className="text-emerald-500 text-xl"
              />
            </div>
            <h3 className="text-gray-900 font-extrabold text-lg mb-2">
              Still need help?
            </h3>
            <p className="text-gray-500 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
              Can't find what you're looking for? Our support team is available{" "}
              <span className="text-emerald-600 font-semibold">24/7</span> for
              emergency charging issues.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="mailto:support@evbharat.com"
                className="inline-flex items-center gap-2
                           bg-gradient-to-r from-emerald-500 to-teal-500
                           text-white px-6 py-3 rounded-xl text-sm font-semibold
                           shadow-md shadow-emerald-200
                           hover:shadow-lg hover:brightness-110
                           hover:scale-105 active:scale-95
                           transition-all duration-200"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                Email Support
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2
                           bg-white border border-emerald-200
                           text-emerald-600 px-6 py-3 rounded-xl text-sm font-semibold
                           shadow-sm hover:bg-emerald-50
                           hover:scale-105 active:scale-95
                           transition-all duration-200"
              >
                <FontAwesomeIcon icon={faHeadset} className="text-xs" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50
                    w-11 h-11 rounded-full
                    bg-gradient-to-br from-emerald-500 to-teal-500
                    text-white shadow-lg shadow-emerald-200
                    flex items-center justify-center
                    hover:scale-110 active:scale-95
                    transition-all duration-300
                    ${
                      showTop
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
      >
        <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
      </button>
    </div>
  );
}

export default HelpCenter;
