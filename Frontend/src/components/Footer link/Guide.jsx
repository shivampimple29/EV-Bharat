import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMapLocationDot,
  faBolt,
  faPlus,
  faCircleCheck,
  faArrowRight,
  faUsers,
  faLeaf,
  faShieldHalved,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

function Guide() {
  const [visible, setVisible] = useState(false);
  const [whyVis, setWhyVis] = useState(false);
  const whyRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setWhyVis(true);
      },
      { threshold: 0.15 },
    );
    if (whyRef.current) observer.observe(whyRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: faSearch,
      color: "emerald",
      step: "01",
      title: "Search a Location",
      desc: "Type your city, area, or station name in the search bar. EV Bharat instantly surfaces the nearest charging points.",
    },
    {
      icon: faMapLocationDot,
      color: "teal",
      step: "02",
      title: "Explore the Map",
      desc: "Browse the live map or station list to view locations, charger availability, operators, and pricing at a glance.",
    },
    {
      icon: faBolt,
      color: "emerald",
      step: "03",
      title: "Pick Your Charger",
      desc: "Filter by connector type — CCS2, CHAdeMO, Type 2, or Bharat AC/DC — to find stations compatible with your EV.",
    },
    {
      icon: faPlus,
      color: "teal",
      step: "04",
      title: "Add a Station",
      desc: "Spotted a station we missed? Contribute to the community by submitting it via the Add Station form.",
    },
  ];

  const whyItems = [
    {
      icon: faMapLocationDot,
      title: "Pan-India Coverage",
      desc: "Stations mapped across 500+ cities from metros to tier-3 towns.",
      color: "emerald",
    },
    {
      icon: faGaugeHigh,
      title: "Real-Time Data",
      desc: "Availability updated regularly via network partners and community reports.",
      color: "teal",
    },
    {
      icon: faUsers,
      title: "Community Driven",
      desc: "Users contribute station updates, reviews, and new locations daily.",
      color: "emerald",
    },
    {
      icon: faShieldHalved,
      title: "Verified Stations",
      desc: "All submissions are reviewed within 24 hours before going live.",
      color: "teal",
    },
    {
      icon: faLeaf,
      title: "Green Mission",
      desc: "Every station added helps accelerate India's EV transition.",
      color: "emerald",
    },
    {
      icon: faBolt,
      title: "All Connector Types",
      desc: "CCS2, CHAdeMO, Type 2, Bharat AC/DC, GB/T — all listed.",
      color: "teal",
    },
  ];

  const colorMap = {
    emerald: {
      icon: "bg-emerald-100 text-emerald-600",
      step: "text-emerald-200",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/80",
      glow: "from-emerald-500/5",
      accent: "from-emerald-400 to-teal-500",
      check: "text-emerald-500",
      why: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    teal: {
      icon: "bg-teal-100 text-teal-600",
      step: "text-teal-200",
      hover: "hover:border-teal-200 hover:shadow-teal-100/80",
      glow: "from-teal-500/5",
      accent: "from-teal-400 to-emerald-500",
      check: "text-teal-500",
      why: "bg-teal-50 text-teal-600 border-teal-100",
    },
  };

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

      <div className="relative max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5
                           rounded-full bg-emerald-50 border border-emerald-200
                           text-emerald-600 text-xs font-bold uppercase tracking-widest mb-5
                           transition-all duration-500
                           ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Getting Started
          </div>

          <h1
            className={`text-4xl md:text-5xl font-extrabold text-gray-900
                          tracking-tight leading-tight
                          transition-all duration-600 ease-out delay-100
                          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            How to Use{" "}
            <span
              className="bg-gradient-to-r from-emerald-400 to-teal-500
                             bg-clip-text text-transparent"
            >
              EV Bharat
            </span>
          </h1>

          <div
            className={`h-px w-24 mx-auto mt-3 mb-5
                           bg-gradient-to-r from-transparent via-emerald-400 to-transparent
                           transition-all duration-1000 ease-out delay-300
                           ${visible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          />

          <p
            className={`text-gray-500 text-base leading-relaxed
                         transition-all duration-600 ease-out delay-200
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            Get from zero to charged in four simple steps. Finding, filtering,
            and contributing to India's EV network has never been{" "}
            <span className="text-emerald-600 font-semibold">this easy</span>.
          </p>
        </div>

        {/* ── Steps Grid ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {steps.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <div
                key={i}
                className={`group relative bg-white rounded-2xl p-6
                            border border-gray-100 shadow-sm overflow-hidden
                            hover:shadow-xl hover:-translate-y-1 ${c.hover}
                            transition-all duration-300
                            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  transitionDelay: visible ? `${300 + i * 100}ms` : "0ms",
                  transitionDuration: "600ms",
                }}
              >
                {/* Accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5
                                 bg-gradient-to-r ${c.accent}
                                 scale-x-0 group-hover:scale-x-100 origin-left
                                 transition-transform duration-500`}
                />

                {/* Corner glow */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20
                                 bg-gradient-to-bl ${c.glow} to-transparent
                                 rounded-bl-full opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Step number — watermark */}
                <div
                  className={`absolute bottom-4 right-5 text-3xl font-black
                                 ${c.step} select-none pointer-events-none
                                 transition-all duration-300
                                 group-hover:scale-110 group-hover:opacity-80`}
                >
                  {step.step}
                </div>

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl ${c.icon}
                                 flex items-center justify-center mb-4
                                 group-hover:scale-110 transition-transform duration-300`}
                >
                  <FontAwesomeIcon icon={step.icon} className="text-base" />
                </div>

                <h2
                  className="text-sm font-bold text-gray-900 mb-2
                               group-hover:text-emerald-700
                               transition-colors duration-200 leading-snug"
                >
                  {step.title}
                </h2>

                <p className="text-gray-500 text-xs leading-relaxed pr-6">
                  {step.desc}
                </p>

                {/* Arrow */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:flex absolute -right-3 top-1/2
                                  -translate-y-1/2 z-10
                                  w-6 h-6 rounded-full bg-white border border-gray-200
                                  items-center justify-center shadow-sm"
                  >
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-emerald-400 text-[9px]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Why EV Bharat ── */}
        <div
          ref={whyRef}
          className={`bg-white rounded-2xl border border-gray-100
                      shadow-sm overflow-hidden
                      transition-all duration-700 ease-out
                      ${whyVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600
                              flex items-center justify-center shrink-0"
              >
                <FontAwesomeIcon icon={faCircleCheck} className="text-base" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  Why Use EV Bharat?
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Built for India's EV revolution
                </p>
              </div>
            </div>

            <div
              className="h-px bg-gradient-to-r from-emerald-100
                            via-gray-100 to-transparent my-6"
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyItems.map((item, i) => {
                const c = colorMap[item.color];
                return (
                  <div
                    key={i}
                    className={`group flex items-start gap-3 p-4 rounded-xl
                                border ${c.why}
                                hover:-translate-y-0.5 hover:shadow-sm
                                transition-all duration-200 cursor-default`}
                    style={{
                      transitionDelay: whyVis ? `${i * 70}ms` : "0ms",
                      opacity: whyVis ? 1 : 0,
                      transform: whyVis ? "translateY(0)" : "translateY(12px)",
                      transition: "all 0.5s ease",
                    }}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl ${c.icon}
                                     flex items-center justify-center shrink-0
                                     group-hover:scale-110
                                     transition-transform duration-200`}
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-xs" />
                    </div>

                    <div>
                      <p
                        className="text-sm font-bold text-gray-900 mb-0.5
                                    group-hover:text-emerald-700
                                    transition-colors duration-200"
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
